const feedRead = require('davefeedread');
const TurndownService = require('turndown');
const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
}).keep(['iframe']);
const cheerio = require('cheerio');
const uuid = require('uuid/v4'); // v4 generates random UUIDs
const url = require('url');
const path = require('path');

const importPosts = async (file) => {
    const feed = await parseFeed(file);

    const isPost = item => ['post', 'page'].includes(item['wp:post_type']['#']);
    const isPublished = item => item['wp:status']['#'] === 'publish';

    // Filter for only blog posts
    var items = feed.items.filter(isPost).filter(isPublished);
    
    // Map to new object type
    items = items.map(item => {
        const postType = item['wp:post_type']['#'];
        if (!isPost(item)) {
            return;
        }

        const mappedItem = {
            'title': item.title,
            'date': item.date,
            'content': item['content:encoded']['#'],
            'categories': item.categories,
            'slug': item['wp:post_name']['#']
        };

        const [year, month, day, ...slug] = mappedItem.slug.split('/');
        mappedItem.path = [postType, year, ...slug].join('/');

        // Add passthroughUrl if exists
        const postMeta = item['wp:postmeta'];
        if (postMeta) {
            const metaKey = postMeta['wp:meta_key'];
            if (metaKey) {
                const metaKeyValue = metaKey['#'];
                if (metaKeyValue == 'passthrough_url') {
                    mappedItem.passthroughUrl = postMeta['wp:meta_value']['#'];
                }
            }
        }

        // Add images array
        const images = parseImages(mappedItem.content);
        images.forEach(image => {
            mappedItem.content = mappedItem.content.replace(image.url, image.fileName);
        });
        mappedItem.images = images;

        // Strip out Squarespace content tags
        mappedItem.content = removeSquarespaceCaptions(mappedItem.content);

        // Add Markdown conversion
        mappedItem.markdownContent = turndownService.turndown(mappedItem.content);

        return mappedItem;
    });

    return items;
};

const parseFeed = (file) => {
    return new Promise((resolve, reject) => {
        feedRead.parseString(file, undefined, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

const parseImages = (content) => {
    const postElements = cheerio.load(content);
    const imagesElements = postElements('img');
    const images = imagesElements.map((index, item) => {
        const imageName = uuid();
        const imageUrl = item.attribs['data-image'] || item.attribs['data-src'] || item.attribs['src'];
        if (!imageUrl) {

            return null;
        }
        const imageExtension = path.extname(url.parse(imageUrl).pathname);
        return {
            url: imageUrl,
            fileName: `${imageName}${imageExtension}`
        };
    }).filter(x => x !== null).toArray();
    return images;
};

const removeSquarespaceCaptions = (post) => {
    // remove the caption crap that gets put in by squarespace
    post = post.replace(/(\[caption.*"])(<.*>)(.*\[\/caption])/g, '$2'); 
    return post;
};

module.exports = { importPosts };