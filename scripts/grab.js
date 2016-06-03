'use strict';

const fs = require('bluebird').promisifyAll(require('fs-extra'));
const {join} = require('path');
const marked = require('meta-marked');
const config = require('../src/content/config.json');
const mdFiles = require('glob').sync('src/content/*/*.md'); // TODO: get from config

const results = mdFiles.map(file => {
  const md = fs.readFileSync(file, 'utf-8');
  const parsed = marked(md);

  return {
    fileName: file.split('/').reverse()[0],
    layout: file.split('/').reverse()[1],
    path: file,
    lang: file.split('.').reverse()[1],
    meta: parsed.meta,
    content: parsed.html // TODO: posthtml?
  };
});

fs.outputFileSync(join('dist', 'data.json'), JSON.stringify(results));
