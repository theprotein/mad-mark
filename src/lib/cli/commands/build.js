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
      .def('.')
      .end()
    .act(opts => build(opts.INPUT));
};
