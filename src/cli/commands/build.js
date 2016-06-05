'use strict';

const build = require('../../scripts/build.js');
const {join} = require('path');

module.exports = function() {
  return this
    .title('Build static')
    .helpful()
    .opt()
      .name('INPUT')
      .title('Input folder')
      .short('i')
      .end()
    .opt()
      .name('OUTPUT')
      .title('Output folder')
      .short('o')
      .end()
    .act(function(opts) {
      const {INPUT,OUTPUT} = opts;

      INPUT && OUTPUT && build(
        join(process.cwd(), INPUT),
        join(process.cwd(), OUTPUT)
      );
    });
};
