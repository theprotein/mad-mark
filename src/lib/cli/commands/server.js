'use strict';

const {join} = require('path');
const nodemon = require('nodemon');
const bs = require('browser-sync');
const infoSymbol = require('log-symbols').info;

module.exports = function() {
  return this
    .title('Serve static')
    .helpful()
    .opt()
      .name('INPUT')
      .title('Input folder')
      .short('i')
      .def('.')
      .end()
    .act(function(opts) {
      const {INPUT} = opts;
      const userConfig = require(join(process.cwd(), INPUT, 'config'));

      nodemon({
        watch: [
          INPUT
        ],
        ignore: [userConfig.output],
        ext: 'bemhtml.js js css post.css svg md json',
        exec: `bemark build -i ${INPUT}`
      });

      bs.init({
        server: {
          baseDir: userConfig.output
        },
        files: [
          join(userConfig.output, 'css', '*.css'),
          join(userConfig.output, 'js', '*.js'),
          join(userConfig.output, '*.html'),
          join(userConfig.output, '*.*.html'),
          join(userConfig.output, '**', '*.html'),
          join(userConfig.output, '**', '*.*.html')
        ],
        tunnel: false,
        online: false,
        open: false,
        notify: userConfig.debug,
        logPrefix: infoSymbol,
        logFileChanges: userConfig.debug,
        logLevel: userConfig.debug ? 'debug' : 'info'
      });

      nodemon.on('quit', function () {
        bs.exit();
        process.exit(0);
      });
    });
};
