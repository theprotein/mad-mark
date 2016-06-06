'use strict';

const fs = require('fs-extra');
const {join} = require('path');
const {exec} = require('child_process');

const log = require('../lib/log');
const grabMd = require('./grab');
const generateStatic = require('./generate');

const decl = `exports.blocks=[{name:'root'}]`;

module.exports = function (INPUT, OUTPUT) {
  const userConfig = require(join(INPUT, 'config'));
  const ENB_DIR = join(OUTPUT, '.enb');
  const ENB = join(ENB_DIR, 'make.js');

  log.verbose('clean output folder', OUTPUT);
  fs.removeSync(OUTPUT);

  log.verbose('touch declaration');
  fs.outputFileSync(join(OUTPUT, 'bundles', 'index', 'index.bemdecl.js'), decl);

  log.verbose('prepare config for enb in', ENB);
  fs.copySync(join(__dirname, 'make.js'), ENB);

  log.verbose('exec enb');
  exec(`cd ${OUTPUT} && BBIN=${INPUT} BBOUT=${OUTPUT} enb make`, (err) => {
    if(err) {
      log.error(err);
      return;
    };

    grabMd(userConfig, INPUT, OUTPUT);
    generateStatic(userConfig, INPUT, OUTPUT);

    log.verbose('ensure nojekyll file');
    fs.ensureFileSync(join(OUTPUT, '.nojekyll'));

    log.verbose('clean temp files and folders');
    fs.removeSync(ENB_DIR);
    fs.removeSync(join(OUTPUT, 'data.json'));
  });
}
