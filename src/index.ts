import fs from 'fs-extra';
import minimist from 'minimist';
import path from 'path';

const args = minimist(process.argv.slice(2));
import { importPosts } from './importer';
import { exportPosts } from './exporter';

const runner = async () => {
  console.log(args);
  if (args._.length < 2) {
    console.error('Expects at least input file as first parameter, and export directory as second.');
    process.exit(1);
  }

  const inputFilePath = args._[0];
  const outputDir = args._[1];

  const isPage = !!args.pages;
  const postType = isPage ? 'page' : 'post';
  const [, postCategory] = outputDir.split('/');
    
  const inputFile = fs.readFileSync(inputFilePath, 'utf8');
  const posts = await importPosts(inputFile, postType, postCategory);
  await exportPosts(posts, path.resolve(outputDir));
};

runner();
