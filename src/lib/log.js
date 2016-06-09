'use strict';

const winston = require('winston');

module.exports = function (debug) {
  return new winston.Logger({
    transports: [
      new (winston.transports.Console)({
        level: debug ? 'verbose' : 'info',
        showLevel: false,
        colorize: true
      })
    ]
  });
}
