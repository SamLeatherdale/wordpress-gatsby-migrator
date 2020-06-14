import cheerio from 'cheerio';
import feedRead from 'davefeedread';
import TurndownService from 'turndown';
import sanitizeFilename from 'sanitize-filename';
import path from 'path';
import url from 'url';
import { Feed, Post, PostImage } from './types';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
}).keep(['iframe']);

export const importPosts = async (file: string, postType: string, postCategory: string): Promise<Post[]> => {
  const feed: Feed = await parseFeed(file);

  const filterPostType = item => (item['wp:post_type']['#'] === postType);
  const isPublished = item => item['wp:status']['#'] === 'publish';

  // Filter for only blog posts
  const items = feed.items.filter(filterPostType).filter(isPublished);
    
  // Map to new object type
  return items.map(item => {
    const postType = item['wp:post_type']['#'];
    const slug = item['wp:post_name']['#'];

    const [year, month, day, ...restSlug] = slug.split('/');
    const path = [year, ...restSlug].join('/');

    // Add passthroughUrl if exists
    const postMeta = item['wp:postmeta'];
    let passthroughUrl;
    if (postMeta) {
      const metaKey = postMeta['wp:meta_key'];
      if (metaKey) {
        const metaKeyValue = metaKey['#'];
        if (metaKeyValue == 'passthrough_url') {
          passthroughUrl = postMeta['wp:meta_value']['#'];
        }
      }
    }

    // Add images array
    let content = item['content:encoded']['#'];
    const imagesResult = parseImages(content);
    content = imagesResult.content;
    const images = imagesResult.images;

    // Strip out Squarespace content tags
    content = removeSquarespaceCaptions(content);

    // Add Markdown conversion
    const markdownContent = turndownService.turndown(content);

    const post: Post = {
      title: item.title.replace(/"/g, '\\"'), // escape quotes,
      date: item.date,
      category: postCategory,
      content,
      images,
      markdownContent,
      slug,
      path,
      passthroughUrl,
      postType
    };
    return post;
  });
};

const parseFeed = (file: string): Promise<Feed> => {
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

type ParseImagesResult = {
  content: string,
  images: PostImage[]
};

const parseImages = (content): ParseImagesResult  => {
  const doc = cheerio.load(content);

  // Clean up problematic elements
  doc('noscript').remove(); // noscript is not touched by cheerio, but remains in the output
  doc('a').each((i, el) => {
    const $el = cheerio(el);
    if ($el.find('img').length > 0) {
      // Fix for issue https://github.com/domchristie/turndown/issues/332
      $el.html(doc.html($el.find('img')));
    }
  });
  const imagesElements = doc('img');

  const images: Map<string, PostImage> = new Map();
  imagesElements.each((index, item) => {
    const img = cheerio(item);
    const imageUrl = img.attr('data-image')
      || img.attr('data-src')
      || img.attr('src');
    if (!imageUrl) {
      return;
    }

    let alt = img.attr('alt');
    if (alt) {
      alt = alt.trim();
      img.attr('alt', alt);
    }

    const parsedUrl = url.parse(imageUrl);
    const imageFilename = parsedUrl.pathname;
    const imageExt = path.extname(imageFilename);
    const imageName = sanitizeFilename(
      decodeURIComponent(
        path.basename(imageFilename, imageExt)
      ).replace(/\+/g, '-') //.replace(/[^A-Za-z0-9-]/, '')
    );

    const i = 2;
    let newName = imageName;
    while (images.has(newName)) {
      newName = `${imageName}-${i}`;
    }

    const filename = `${imageName}${imageExt}`;

    images.set(imageName, {
      url: imageUrl,
      fileName: filename
    });

    // Fix URL
    img.attr('data-image', '');
    img.attr('data-src', '');
    img.attr('src', filename);
  });
  return {
    content: doc.html(),
    images: Array.from(images.values())
  };
};

const removeSquarespaceCaptions = (post: string) => {
  // remove the caption crap that gets put in by squarespace
  post = post.replace(/(\[caption.*"])(<.*>)(.*\[\/caption])/g, '$2'); 
  return post;
};