var techs = {
  fileProvider: require('enb/techs/file-provider'),
  fileMerge: require('enb/techs/file-merge'),
  borschik: require('enb-borschik/techs/borschik'),
  postcss: require('enb-postcss/techs/enb-postcss'),
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
  'node_modules/bem-grid/common.blocks',
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
      [techs.bemtree, { sourceSuffixes: ['bemtree', 'bemtree.js'] }],
      [techs.bemhtml, { sourceSuffixes: ['bemhtml', 'bemhtml.js'] }],
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
      [techs.borschik, { source: '.tmp.js', target: '?.min.js', minify: isProd }],
      [techs.borschik, { source: '.tmp.css', target: '?.min.css', minify: isProd }]
    ]);

    nodeConfig.addTargets(['?.bemtree.js', '?.min.css', '?.min.js']);
  });
};
