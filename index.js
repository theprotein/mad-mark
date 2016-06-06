'use strict';

const {join} = require('path');
const fs = require('fs');

exports.levels = [
  join('node_modules', 'bem-core', 'common.blocks'),
  join('node_modules', 'bem-core', 'desktop.blocks'),
  join('node_modules', 'bem-components', 'common.blocks'),
  join('node_modules', 'bem-components', 'desktop.blocks'),
  join('node_modules', 'bem-grid', 'common.blocks'),
  join('node_modules', 'bemark', 'src', 'components')
];

exports.posthtmlPlugins = [
  require('./src/lib/posthtml-plugins/semantize')
]
