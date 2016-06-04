'use strict';

const fs = require('fs-extra');
const {join} = require('path');
const pkg = require(join(process.cwd(), 'package.json'));
const {exec} = require('child_process');

const grabMd = require('./grab');
const generateStatic = require('./generate');

const decl = `exports.blocks=[{name:'root'}]`;
const INPUT = join(process.cwd(), pkg.static);
const OUTPUT = join(process.cwd(), 'dist');
const userConfig = require(join(INPUT, 'config.json'));
const TMP = join(OUTPUT, 'tmp.json');
const ENB = join(OUTPUT, '.enb');

fs.removeSync(OUTPUT);
fs.outputFileSync(join(OUTPUT, 'bundles', 'index', 'index.bemdecl.js'), decl);
fs.outputJsonSync(TMP, { INPUT, OUTPUT });
fs.copySync('./.enb', ENB);

exec(`cd ${OUTPUT} && enb make`, (err) => {
  if(err) console.error(err);

  grabMd(userConfig, INPUT, OUTPUT);
  generateStatic(userConfig, INPUT, OUTPUT);

  fs.ensureFileSync(join(OUTPUT, '.nojekyll'));
  fs.removeSync(TMP);
  fs.removeSync(ENB);
});
