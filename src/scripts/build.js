'use strict';

const fs = require('bluebird').promisifyAll(require('fs-extra'));
const {join} = require('path');
const {exec} = require('child_process');

const log = require('../lib/log');
const grabMd = require('./grab');
const generateStatic = require('./generate');
const defContentDir = 'content';

const decl = [
  {name: 'root'},
  {name: 'page'},
  {name: 'lang-switcher'}
];

module.exports = function (CWD, IN) {
  const INPUT = join(CWD, IN);
  const userConfig = require(join(INPUT, 'config'));
  const OUTPUT = join(CWD, userConfig.output);
  const ENB_DIR = join(OUTPUT, '.enb');
  const ENB = join(ENB_DIR, 'make.js');
  const BUNDLES_DIR = join(OUTPUT, 'bundles');
  const BUNDLE = join(BUNDLES_DIR, 'index');

  log.verbose('clean output folder', OUTPUT);
  fs.removeSync(OUTPUT);

  log.verbose('touch declaration');
  let layouts = [{name: 'root'}];
  let contentPath = join(INPUT, defContentDir);

  fs.readdirSync(contentPath).filter(file => {
    return fs.statSync(join(contentPath, file)).isDirectory();
  }).forEach(layout => layouts.push({name: layout}));

  decl.push({name: 'page', mods: [{ name: 'layout', vals: layouts }]});
  fs.outputFileSync(join(BUNDLE, 'index.bemdecl.js'), `exports.blocks=${JSON.stringify(decl)}`);

  log.verbose('prepare config for enb in', ENB);
  fs.copySync(join(__dirname, 'make.js'), ENB);

  log.verbose('exec enb');
  exec(`cd ${OUTPUT} && BBIN=${INPUT} BBOUT=${OUTPUT} enb make`, (err) => {
    if(err) {
      log.error(err);
      return;
    };

    log.verbose('init grabbing');
    grabMd(userConfig, INPUT, OUTPUT);

    log.verbose('init generation');
    generateStatic(userConfig, INPUT, OUTPUT);

    log.verbose('ensure nojekyll file');
    fs.ensureFileSync(join(OUTPUT, '.nojekyll'));

    log.verbose('move assets');
    Promise.all([
      fs.moveAsync(
        join(BUNDLE, 'index.min.js'),
        join(OUTPUT, 'js', 'scripts.min.js')
      ),
      fs.moveAsync(
        join(BUNDLE, 'index.min.css'),
        join(OUTPUT, 'css', 'styles.min.css')
      )
    ]).then(() => {
      log.verbose('clean temp files and folders');
      fs.removeSync(BUNDLES_DIR);
      fs.removeSync(ENB_DIR);
      fs.removeSync(join(OUTPUT, 'data.json'));
    });
  });
}
