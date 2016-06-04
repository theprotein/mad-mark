'use strict';

const {join, resolve} = require('path');
const {INPUT, OUTPUT} = require('../tmp.json');
const userConfig = require(join(INPUT, 'config.json'));
const root = OUTPUT.replace(userConfig.output, '');

const techs = {
  fileProvider: require('enb/techs/file-provider'),
  fileMerge: require('enb/techs/file-merge'),
  borschik: require('enb-borschik/techs/borschik'),
  postcss: require('enb-postcss/techs/enb-postcss'),
  browserJs: require('enb-js/techs/browser-js'),
  bemtree: require('enb-bemxjst/techs/bemtree'),
  bemhtml: require('enb-bemxjst/techs/bemhtml')
};
const enbBemTechs = require('enb-bem-techs');
const levels = [
  join(root, 'node_modules/bem-core/common.blocks'),
  join(root, 'node_modules/bem-core/desktop.blocks'),
  join(root, 'node_modules/bem-components/common.blocks'),
  join(root, 'node_modules/bem-components/desktop.blocks'),
  join(root, 'node_modules/bem-grid/common.blocks'),
  join(root, !userConfig.bb ? 'node_modules/bb' : '', 'src/layouts'),
  join(root, !userConfig.bb ? 'node_modules/bb' : '', 'src/components'),
  `${join(INPUT, 'themes', userConfig.theme)}`
];

module.exports = function(config) {
  const isProd = process.env.YENV === 'production';

  config.nodes(`${join('bundles', '*')}`, nodeConfig => {
    nodeConfig.addTechs([
      [enbBemTechs.levels, { levels: levels }],
      [techs.fileProvider, { target: '?.bemdecl.js' }],
      [enbBemTechs.deps],
      [enbBemTechs.files],
      [techs.postcss, {
        sourceSuffixes: ['css', 'post.css'],
        target: '.tmp.css',
        sourcemap: true,
        plugins: [
          require('postcss-import'),
          require('postcss-mixins'),
          require('postcss-each'),
          require('postcss-simple-vars')({
            variables: {
              gridMaxWidth: '1000px',
              gridGutter: '0px',
              gridFlex: 'flex'
            }
          }),
          require('lost'),
          require('postcss-cssnext'),
          require('postcss-nested'),
          require('postcss-url')({ url: 'rebase' }),
          require('postcss-font-magician')(),
          require('postcss-browser-reporter'),
          require('postcss-reporter')
        ]
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
      [techs.bemtree, { sourceSuffixes: ['bemtree', 'bemtree.js'] }],
      [techs.bemhtml, { sourceSuffixes: ['bemhtml', 'bemhtml.js'] }],
      [techs.borschik, { source: '.tmp.js', target: '?.min.js', minify: isProd }],
      [techs.borschik, { source: '.tmp.css', target: '?.min.css', minify: isProd }]
    ]);

    nodeConfig.addTargets(['?.bemtree.js', '?.bemhtml.js', '?.min.css', '?.min.js']);
  });
};
