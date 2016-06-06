'use strict';

const winston = require('winston');

module.exports = new winston.Logger({
  transports: [
    new (winston.transports.Console)({
      level: 'verbose',
      colorize: true
    })
  ]
});
