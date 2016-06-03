var techs = {
  fileProvider: require('enb/techs/file-provider'),
  fileMerge: require('enb/techs/file-merge'),
  borschik: require('enb-borschik/techs/borschik'),
  stylus: require('enb-stylus/techs/stylus'),
  browserJs: require('enb-js/techs/browser-js'),
  bemtree: require('enb-bemxjst/techs/bemtree'),
  bemhtml: require('enb-bemxjst/techs/bemhtml')
},
enbBemTechs = require('enb-bem-techs'),
levels = [
  'node_modules/bem-core/common.blocks',
  'node_modules/bem-core/desktop.blocks',
  'node_modules/bem-components/common.blocks',
  'node_modules/bem-components/desktop.blocks',
  'node_modules/bem-components/design/common.blocks',
  'node_modules/bem-components/design/desktop.blocks',
  'desktop.blocks',
  'themes/simple.blocks'
];

module.exports = function(config) {
  var isProd = process.env.YENV === 'production';

  config.nodes('*.bundles/*', function(nodeConfig) {
    nodeConfig.addTechs([
      [enbBemTechs.levels, { levels: levels }],
      [techs.fileProvider, { target: '?.bemdecl.js' }],
      [enbBemTechs.deps],
      [enbBemTechs.files],
      [techs.stylus, {
        target: '?.css',
        sourcemap: false,
        autoprefixer: {
          browsers: ['ie >= 10', 'last 2 versions', 'opera 12.1', '> 2%']
        }
      }],
      [techs.bemtree, { sourceSuffixes: ['bemtree', 'bemtree.js'] }],
      [techs.bemhtml, { sourceSuffixes: ['bemhtml', 'bemhtml.js'] }],
      [enbBemTechs.depsByTechToBemdecl, {
        target: '?.bemhtml.bemdecl.js',
        sourceTech: 'js',
        destTech: 'bemhtml'
      }],
      [enbBemTechs.deps, {
        target: '?.bemhtml.deps.js',
        bemdeclFile: '?.bemhtml.bemdecl.js'
      }],
      [enbBemTechs.files, {
        depsFile: '?.bemhtml.deps.js',
        filesTarget: '?.bemhtml.files',
        dirsTarget: '?.bemhtml.dirs'
      }],
      [techs.bemhtml, {
        target: '?.browser.bemhtml.js',
        filesTarget: '?.bemhtml.files',
        sourceSuffixes: ['bemhtml', 'bemhtml.js']
      }],
      [techs.browserJs, {
        includeYM: true
      }],
      [techs.fileMerge, {
        target: '?.js',
        sources: ['?.browser.js', '?.browser.bemhtml.js']
      }],
      [techs.borschik, { source: '?.js', target: '?.min.js', minify: isProd }],
      [techs.borschik, { source: '?.css', target: '?.min.css', minify: isProd }]
    ]);

    nodeConfig.addTargets(['?.bemtree.js', '?.min.css', '?.min.js']);
  });
};
