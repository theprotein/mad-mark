'use strict';

const nodemon = require('nodemon');
const bs = require('browser-sync');

nodemon({
  watch: [
    'src/components',
    'src/content',
    'bundles/**/*.bemdecl.js',
  ],
  ext: 'bemhtml.js js css post.css svg md json',
  exec: 'npm run build'
});

bs.init({
  server: {
    baseDir: './dist'
  },
  files: [
    './dist/**/*.css',
    './dist/**/*.js',
    './dist/**/*.html',
    './dist/**/*.*.html'
  ],
  tunnel: false,
  online: false,
  open: false,
  notify: false
});

nodemon.on('quit', function () {
  bs.exit();
  process.exit(0);
});
