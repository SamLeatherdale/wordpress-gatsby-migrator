#!/usr/bin/env node
const fs = require('fs-extra');
const args = require('minimist')(process.argv.slice(2));

const importer = require('./importer.js');
const exporter = require('./exporter.js');

const runner = async () => {
    console.log(args);
    if (args._.length < 2) {
        console.error('Expects at least input file as first parameter, and export directory as second.');
        process.exit(1);
    }

    const inputFilePath = args._[0];
    const outputDir = args._[1];
    
    const inputFile = fs.readFileSync(inputFilePath, 'utf8');
    const posts = await importer.importPosts(inputFile);
    await exporter.exportPosts(posts, outputDir);
};

runner();
