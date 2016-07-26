'use strict';

const fs = require('bluebird').promisifyAll(require('fs-extra'));
const {join} = require('path');
const successSymbol = require('log-symbols').success;

const {make} = require('enb');
const getEnbConfig = require('./make.js');

const grabMd = require('./grab');
const generateStatic = require('./generate');
const defContentDir = 'content';

const decl = [
  {name: 'root'},
  {name: 'page'},
  {name: 'lang-switcher'}
];

module.exports = function (IN) {
  const CWD = process.cwd();
  const INPUT = join(CWD, IN);
  const userConfig = require(join(INPUT, 'config'));
  const OUTPUT = join(CWD, userConfig.output);

  const ENB_DIR = join(CWD, '.enb');
  fs.ensureDirSync(ENB_DIR);

  const TMP = join(CWD, '.mark');
  const BUNDLE = join(TMP, 'index');
  const log = require('../lib/log')(userConfig.debug);

  log.verbose('touch declaration');
  let layouts = [{name: 'root'}];
  let contentPath = join(INPUT, defContentDir);

  fs.readdirSync(contentPath).filter(file => {
    return fs.statSync(join(contentPath, file)).isDirectory();
  }).forEach(layout => layouts.push({name: layout}));

  decl.push({name: 'page', mods: [{ name: 'layout', vals: layouts }]});
  fs.outputFileSync(join(BUNDLE, 'index.bemdecl.js'), `exports.blocks = ${JSON.stringify(decl, null, 4)}`);

  log.verbose('clean old data');
  fs.removeSync(OUTPUT);
  fs.removeSync(join(TMP, 'data.json'));

  log.verbose('exec enb');

  make({config: getEnbConfig(userConfig)})
    .then(() => {
      log.verbose('init grabbing');
      return grabMd(userConfig, CWD, INPUT, OUTPUT, log);
    })
    .then(() => {
      log.verbose('init generation');
      generateStatic(userConfig, CWD, INPUT, OUTPUT, log);

      log.verbose('ensure nojekyll file');
      fs.ensureFileSync(join(OUTPUT, '.nojekyll'));
    })
    .then(() => {
      log.verbose('move assets');
      return Promise.all([
        fs.moveAsync(
          join(BUNDLE, 'index.min.js'),
          join(OUTPUT, 'js', 'scripts.min.js')
        ),
        fs.moveAsync(
          join(BUNDLE, 'index.min.css'),
          join(OUTPUT, 'css', 'styles.min.css')
        )
      ]);
    })
    .then(() => {
        log.verbose('clean enb temp');
        fs.removeSync(ENB_DIR);
        fs.removeSync(TMP);

        log.info(`[${successSymbol}]`, 'all done');
    })
    .fail(err => log.error(err))
}
