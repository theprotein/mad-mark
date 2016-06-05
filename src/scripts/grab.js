'use strict';

const fs = require('bluebird').promisifyAll(require('fs-extra'));
const {join} = require('path');
const marked = require('meta-marked');

const log = require('../lib/log');

module.exports = function (userConfig, INPUT, OUTPUT) {
  log.verbose('grab *.md files from', INPUT);
  const dataPath = join(OUTPUT, 'data.json');
  const mdFiles = require('glob').sync(join(INPUT, '*', '*.md'));

  const results = mdFiles.map(file => {
    log.verbose('compile', file);
    const md = fs.readFileSync(file, 'utf-8');
    const compiled = marked(md);
    const fileName = file.split('/').reverse()[0];

    return {
      fileName: fileName,
      name: fileName.split('.')[0],
      layout: file.split('/').reverse()[1],
      path: file,
      lang: file.split('.').reverse()[1],
      meta: compiled.meta,
      content: compiled.html // TODO: posthtml and get plugins by layout
    };
  });

  log.verbose('collect data to', dataPath);
  fs.outputFileSync(dataPath, JSON.stringify(results));
}
