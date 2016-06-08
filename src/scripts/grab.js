'use strict';

const fs = require('bluebird').promisifyAll(require('fs-extra'));
const {join} = require('path');
const marked = require('meta-marked');
const glob = require('glob');
const posthtml = require('posthtml');

const log = require('../lib/log');
const defContentDir = 'content';

module.exports = function (userConfig, CWD, INPUT, OUTPUT) {
  log.verbose('grab *.md files from', INPUT);
  const TMP = join(CWD, '.bemark');
  const dataPath = join(TMP, 'data.json');
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
    const layout = layoutTest === defContentDir ? 'root' : layoutTest;

    const posthtmlPlugins = (userConfig.layouts &&
                            userConfig.layouts[layout] &&
                            userConfig.layouts[layout].posthtmlPlugins) ||
                            userConfig.posthtmlPlugins ||
                            require('bemark').posthtmlPlugins;

    return {
      fileName: fileName,
      name: pageName,
      layout: layout,
      path: file,
      lang: file.split('.').reverse()[1],
      meta: compiled.meta,
      content: posthtml(posthtmlPlugins).process(compiled.html, { sync: true }).tree
    };
  });

  log.verbose('collect data to', dataPath);
  fs.outputFileSync(dataPath, JSON.stringify(results));
}
