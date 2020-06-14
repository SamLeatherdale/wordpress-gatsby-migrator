import fs from 'fs-extra';
import fetch from 'node-fetch';

import { postTemplate } from './templates';
import { Post } from './types';

export const exportPosts = (posts: Post[], rootPath: string) => {
  if (!rootPath.endsWith('/')) {
    rootPath = rootPath + '/';
  }

  posts.forEach(async post => {
    const postPath = `${rootPath}${post.path}`;
    await fs.ensureDir(postPath);

    post.images.forEach(async image => {
      try {
        const imageResponse = await fetch(image.url);
        const writeStream = fs.createWriteStream(`${postPath}/${image.fileName}`);
        imageResponse.body.pipe(writeStream);
        await streamAsync(writeStream);
      } catch (error) {
        console.error(error);
      }
    });

    const fileContents = postTemplate(post);
    await fs.outputFile(`${postPath}/index.md`, fileContents);
  });
};

const streamAsync = (stream) => {
  return new Promise((resolve, reject) => {
    stream.on('end', () => {
      resolve('end');
    });
    stream.on('finish', () => {
      resolve('finish');
    });
    stream.on('error', (error) => {
      reject(error);
    });
  });
};