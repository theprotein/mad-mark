'use strict';

const fs = require('bluebird').promisifyAll(require('fs-extra'));
const {join} = require('path');
const marked = require('meta-marked');

module.exports = function (userConfig, INPUT, OUTPUT) {
  const mdFiles = require('glob').sync(join(INPUT, '*', '*.md'));

  const results = mdFiles.map(file => {
    const md = fs.readFileSync(file, 'utf-8');
    const parsed = marked(md);
    const fileName = file.split('/').reverse()[0];

    return {
      fileName: fileName,
      name: fileName.split('.')[0],
      layout: file.split('/').reverse()[1],
      path: file,
      lang: file.split('.').reverse()[1],
      meta: parsed.meta,
      content: parsed.html // TODO: posthtml and get plugins by layout
    };
  });

  fs.outputFileSync(join(OUTPUT, 'data.json'), JSON.stringify(results));
}
