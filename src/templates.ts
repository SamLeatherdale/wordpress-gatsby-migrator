import { Post } from './types';

export const postTemplate = (post: Post) => {
  const {
    category,
    date,
    markdownContent,
    passthroughUrl,
    postType,
    title,
    slug,
  } = post;

  const header = {
    title,
    slug,
    date: date.toISOString(),
    postType,
    category,
    passthroughUrl
  };

  const headerContent = Array.from(Object.entries(header))
    .filter(([key, value]) => !!value)
    .map(([key, value]) => (
      `${key}: "${value}"`
    ));
  
  return (
    `---
${headerContent.join('\n')}
---

${markdownContent}`
  );
};