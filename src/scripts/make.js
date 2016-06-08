'use strict';

const {join, resolve, basename} = require('path');
const INPUT = process.env.BBIN;
const OUTPUT = process.env.BBOUT;
const userConfig = require(join(INPUT, 'config'));
const CWD = OUTPUT.replace(userConfig.output, '');

const techs = {
  fileProvider: require('enb/techs/file-provider'),
  fileMerge: require('enb/techs/file-merge'),
  fileCopy: require('enb/techs/file-copy'),
  postcss: require('enb-postcss/techs/enb-postcss'),
  browserJs: require('enb-js/techs/browser-js'),
  bemhtml: require('enb-bemxjst/techs/bemhtml')
};
const enbBemTechs = require('enb-bem-techs');
const levels = [].concat(
  require('bemark').levels.map(path => (join(CWD, path))),
  userConfig.themes.map(theme => (`${join(INPUT, 'themes', theme)}`))
);

module.exports = function(config) {
  config.nodes(`${join('.bemark', '*')}`, nodeConfig => {
    nodeConfig.addTechs([
      [enbBemTechs.levels, { levels: levels }],
      [techs.fileProvider, { target: '?.bemdecl.js' }],
      [enbBemTechs.deps],
      [enbBemTechs.files],
      [techs.postcss, {
        sourceSuffixes: ['css', 'post.css'],
        target: '.tmp.css',
        sourcemap: true,
        plugins: userConfig.postcssPlugins || []
      }],
      [enbBemTechs.depsByTechToBemdecl, {
        target: '.tmp.bemhtml.bemdecl.js',
        sourceTech: 'js',
        destTech: 'bemhtml'
      }],
      [enbBemTechs.deps, {
        target: '.tmp.bemhtml.deps.js',
        bemdeclFile: '.tmp.bemhtml.bemdecl.js'
      }],
      [enbBemTechs.files, {
        depsFile: '.tmp.bemhtml.deps.js',
        filesTarget: '?.bemhtml.files',
        dirsTarget: '?.bemhtml.dirs'
      }],
      [techs.bemhtml, {
        target: '.tmp.browser.bemhtml.js',
        filesTarget: '?.bemhtml.files',
        sourceSuffixes: ['bemhtml', 'bemhtml.js']
      }],
      [techs.browserJs, {
        includeYM: true,
        target: '.tmp.browser.js',
      }],
      [techs.fileMerge, {
        target: '.tmp.js',
        sources: ['.tmp.browser.js', '.tmp.browser.bemhtml.js']
      }],
      [techs.bemhtml, { sourceSuffixes: ['bemhtml', 'bemhtml.js'] }],
      [techs.fileCopy, { source: '.tmp.js', target: '?.min.js' }],
      [techs.fileCopy, { source: '.tmp.css', target: '?.min.css' }]
    ]);

    nodeConfig.addTargets(['?.bemhtml.js', '?.min.css', '?.min.js']);
  });
};
