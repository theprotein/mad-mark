'use strict';

const fs = require('bluebird').promisifyAll(require('fs-extra'));
const {join, basename, dirname} = require('path');
const marked = require('meta-marked');
const glob = require('glob');
const posthtml = require('posthtml');
const infoSymbol = require('log-symbols').info;
const defPosthtmlPlugins = require('../../').posthtmlPlugins;

const defContentDir = 'content';

module.exports = function (userConfig, CWD, INPUT, OUTPUT, log) {

  log.info(`[${infoSymbol}]`, `grab *.md files from ${INPUT}...`);
  const TMP = join(process.cwd(), '.mark');
  const dataPath = join(TMP, 'data.json');
  const mdFilesInRoot = glob.sync(join(INPUT, defContentDir, '*.md'));
  const mdFilesWithLayout = glob.sync(join(INPUT, defContentDir, '*', '*.md'));
  const mdFiles = [].concat(mdFilesInRoot, mdFilesWithLayout);

  return Promise.all(mdFiles.map(file => {
    log.verbose('compile', file);
    const md = fs.readFileSync(file, 'utf-8');
    const compiled = marked(md);
    const fileName = basename(file);
    const layoutTest = basename(dirname(file));
    const layout = layoutTest === defContentDir ? 'root' : layoutTest;

    const posthtmlPlugins = (userConfig.layouts &&
                            userConfig.layouts[layout] &&
                            userConfig.layouts[layout].posthtmlPlugins) ||
                            userConfig.posthtmlPlugins ||
                            defPosthtmlPlugins;

    return posthtml(posthtmlPlugins)
      .process(compiled.html)
      .then(({tree}) => {
        return {
          fileName: fileName,
          name: fileName.split('.')[0],
          layout: layout,
          path: file,
          lang: fileName.split('.')[1],
          meta: compiled.meta,
          content: tree
        };
      })
  })).then(results => {
    log.verbose('collect data to', dataPath);
    fs.outputFileSync(dataPath, JSON.stringify(results, null, 4));
  });
}
