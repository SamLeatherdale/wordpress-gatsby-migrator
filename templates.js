const postTemplate = (title, slug, date, passthroughUrl, content) => {
    const post = 
`---
title: "${title}"
slug: "${slug}"
date: "${date}"${passthroughUrl ? `
passthroughUrl: ${passthroughUrl}` : ''}
---

${content}`;
    return post;
};

module.exports = { post: postTemplate };