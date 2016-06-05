'use strict';

const fs = require('fs-extra');
const {join} = require('path');
const {exec} = require('child_process');

const grabMd = require('./grab');
const generateStatic = require('./generate');

const decl = `exports.blocks=[{name:'root'}]`;

module.exports = function (INPUT, OUTPUT) {
  const userConfig = require(join(INPUT, 'config.json'));
  const ENB = join(OUTPUT, '.enb');

  fs.removeSync(OUTPUT);
  fs.outputFileSync(join(OUTPUT, 'bundles', 'index', 'index.bemdecl.js'), decl);
  fs.copySync('./.enb', ENB);

  exec(`cd ${OUTPUT} && BBIN=${INPUT} BBOUT=${OUTPUT} enb make`, (err) => {
    if(err) console.error(err);

    grabMd(userConfig, INPUT, OUTPUT);
    generateStatic(userConfig, INPUT, OUTPUT);

    fs.ensureFileSync(join(OUTPUT, '.nojekyll'));
    fs.removeSync(ENB);
  });
}
