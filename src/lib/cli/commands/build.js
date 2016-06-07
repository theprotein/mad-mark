'use strict';

const build = require('../../../scripts/build.js');
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
    .act(function(opts) {
      const {INPUT} = opts;
      INPUT && build(process.cwd(), INPUT);
    });
};
