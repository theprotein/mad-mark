'use strict';

const {join} = require('path');
const fs = require('fs-extra');

module.exports = function() {
  return this
    .title('Init static folder')
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
    .opt()
      .name('LANGS')
      .title('i18n langs')
      .short('l')
      .end()
    .act(function(opts) {
      const {INPUT,OUTPUT,LANGS} = opts;
      if(INPUT && OUTPUT) {
        const pkg = require(join(process.cwd(), 'package.json'));
        const CWD = join(process.cwd(), INPUT);
        const langs = LANGS.split(',');
        fs.outputFileSync(join(CWD, 'config.js'), configTmpl(langs, pkg.name, OUTPUT));
        fs.outputFileSync(join(CWD, 'i18n.js'), i18nTmpl(langs, pkg.name));
        fs.outputFileSync(join(CWD, 'themes', pkg.name, 'page', 'page.deps.js'), '({shouldDeps: [{mods: {layout: [\'artiсles\']}}]});');
        fs.outputFileSync(join(CWD, 'themes', pkg.name, 'page', '_layout', 'page_layout_articles.bemhtml.js'), 'block(\'page\').mod(\'layout\', \'artiсles\')();');
        langs.forEach(lang => {
          fs.outputFileSync(join(CWD, 'content', `index.${lang}.md`), helloWorldTmpl(langs, lang));
          fs.outputFileSync(join(CWD, 'content', 'articles', `index.${lang}.md`), articleTmpl(lang));
        });
      }
    });
};

function configTmpl(langs, name, output) {
  const config = {
    themes: [name],
    langs: langs,
    output: output
  };
  return `module.exports = ${JSON.stringify(config)};`;
}

function i18nTmpl(langs, name) {
  const i18n = {};
  langs.forEach(lang => {
    i18n[lang] = {
      title: `Title - ${name}`
    };
  });
  return `module.exports = ${JSON.stringify(i18n)};`;
}

function helloWorldTmpl(langs, lang) {
  return `Hello, World!
=============

Any content in markdown goes here...

[Read articles in ${lang}](articles/index${resolveLang(langs, lang)}.html)
`;
}

function articleTmpl(lang) {
  return `Article in ${lang}
=================

Any content in markdown goes here...
`;
}

function resolveLang(langs, lang) {
  return lang === langs[0] ? '' : `.${lang}`;
}
