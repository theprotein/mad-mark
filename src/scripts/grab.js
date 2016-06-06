'use strict';

const fs = require('bluebird').promisifyAll(require('fs-extra'));
const {join} = require('path');
const marked = require('meta-marked');
const glob = require('glob');

const log = require('../lib/log');
const defContentDir = 'content';

module.exports = function (userConfig, INPUT, OUTPUT) {
  log.verbose('grab *.md files from', INPUT);
  const dataPath = join(OUTPUT, 'data.json');
  const mdFilesInRoot = glob.sync(join(INPUT, defContentDir, '*.md'));
  const mdFilesWithLayout = glob.sync(join(INPUT, defContentDir, '*', '*.md'));
  const mdFiles = [].concat(mdFilesInRoot, mdFilesWithLayout);

  const results = mdFiles.map(file => {
    log.verbose('compile', file);
    const md = fs.readFileSync(file, 'utf-8');
    const compiled = marked(md);
    const fileName = file.split('/').reverse()[0];
    const pageName = fileName.split('.')[0];

    const layoutTest = file.split('/').reverse()[1];
    return {
      fileName: fileName,
      name: pageName,
      layout: layoutTest === defContentDir ? 'root' : layoutTest,
      path: file,
      lang: file.split('.').reverse()[1],
      meta: compiled.meta,
      content: compiled.html // TODO: posthtml and get plugins by layout
    };
  });

  log.verbose('collect data to', dataPath);
  fs.outputFileSync(dataPath, JSON.stringify(results));
}
