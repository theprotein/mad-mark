'use strict';

const fs = require('bluebird').promisifyAll(require('fs-extra'));
const {join} = require('path');
const {exec} = require('child_process');
const successSymbol = require('log-symbols').success;

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
  const ENB_DIR = join(CWD, '.enb');
  const ENB = join(ENB_DIR, 'make.js');
  const TMP = join(CWD, '.bemark');
  const BUNDLE = join(TMP, 'index');
  const log = require('../lib/log')(userConfig.debug);

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

  log.verbose('clean old data');
  fs.removeSync(OUTPUT);
  fs.removeSync(join(TMP, 'data.json'));

  log.verbose('exec enb');
  exec(`BBIN=${INPUT} BBOUT=${OUTPUT} enb make`, (error, stdout, stderr) => {
    if(error) {
      throw new Error(error);
      console.error(error);
      console.log('\n');
    };

    if(userConfig.debug) {
      console.log(stdout);
      console.log('\n');
    }

    log.verbose('init grabbing');
    grabMd(userConfig, CWD, INPUT, OUTPUT, log);

    log.verbose('init generation');
    generateStatic(userConfig, CWD, INPUT, OUTPUT, log);

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
      log.verbose('clean enb temp');
      fs.removeSync(ENB_DIR);

      log.info(`[${successSymbol}]`, 'all done');
    });
  });
}
