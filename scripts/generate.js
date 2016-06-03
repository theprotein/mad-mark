'use strict';

const {join, resolve} = require('path');
const fs = require('bluebird').promisifyAll(require('fs-extra'));
const {BEMTREE} = require('../bundles/index/index.bemtree.js');
const {BEMHTML} = require('../bundles/index/index.bemhtml.js');

const config = require('../src/content/config.json');
const outputFolder = 'dist';
const i18n = require('../src/content/i18n.json');
const data = require('../' + outputFolder + '/data.json');
const langs = config.langs;
const tags = getTags(data);
const user = config.users[0];

langs.forEach(lang => {

  const contentByLang = getContentByLang(data)[lang];

  Object.keys(contentByLang).forEach(layout => {
    const contentByLayout = contentByLang[layout];

    const paginate = config.layouts[layout] && config.layouts[layout].paginate;
    if (paginate) {
      let paginatedPosts = [];
      let totalPages = calcPages(contentByLayout.length, paginate);

      for (let i = 0, curPage = 0; i < contentByLayout.length; i++) {
        i > 0 && (i % paginate == 0) && curPage++;
        paginatedPosts[curPage] = (paginatedPosts[curPage] || []).concat(contentByLayout[i]);
      }

      paginatedPosts.forEach((page, idx) => {
        const pagePath = resolve('./' + outputFolder + '/' + layout + '/' + 'index' + (idx ? '-' + idx : '') + (lang == 'en' ? '' : '.' + lang) + '.html');

        const bemjson = BEMTREE.apply({
          block: 'root',
          mods: { layout: layout },
          title: config.title && config.title[lang] || '',
          subtitle: config.subtitle && config.subtitle[lang] || '',
          data: page,
          lang: lang,
          user: user,
          pagination: {
            totalPages: totalPages,
            idx: idx,
            isLast: totalPages == idx + 1,
            needPagination: totalPages > 1
          }
        });

        fs.outputFileSync(pagePath, BEMHTML.apply(bemjson));
      });
    }

    contentByLayout.forEach(page => {
      page.meta = page.meta || {};

      const bemjson = BEMTREE.apply({
        block: 'root',
        mods: { layout: layout },
        title: config.title && config.title[lang] || '',
        subtitle: config.subtitle && config.subtitle[lang] || '',
        data: page,
        lang: lang,
        user: user
      });

      fs.outputFileSync(join(outputFolder, layout, page.fileName.split('.')[0] + (lang == 'en' /*get def lang from config*/ ? '' : '.' + lang) + '.html'), BEMHTML.apply(bemjson));
    });

  });



  // генерация индексов по тегам
  // tags[lang] && tags[lang].forEach(tag => {
  //   const pagePath = resolve('./' + outputFolder + '/tag-'+ tag + '.' + lang + '.html');
  //   const bemjson = BEMTREE.apply({
  //     block: 'root',
  //     title: config.title && config.title[lang] || '',
  //     subtitle: config.subtitle && config.subtitle[lang] || '',
  //     data: langPosts.filter(post => (
  //       post.meta && post.meta.tags && post.meta.tags.indexOf(tag) > -1
  //     )),
  //     lang: lang,
  //     user: user
  //   });
  //   fs.writeFileSync(pagePath, BEMHTML.apply(bemjson));
  // });

});

// get from config???
// function getLangs(data) {
//   return data.reduce((prev, cur) => {
//     prev.indexOf(cur.lang) < 0 && prev.push(cur.lang);
//     return prev;
//   }, []);
// }

function getTags(data) {
  return data.reduce((prev, cur) => {
    cur.meta && cur.meta.tags && cur.meta.tags.forEach(tag => {
      prev[cur.lang] = prev[cur.lang] || [];
      prev[cur.lang].indexOf(tag) < 0 && prev[cur.lang].push(tag);
    });

    return prev;
  }, {});
}

function calcPages(postsLength, postsPerPage) {
  return +(postsLength / postsPerPage).toFixed() + (postsLength % postsPerPage ? 1 : 0);
}

/**
 * getContentByLang - description
 *
 * @param  {Array} data
 * @return {Object} { en: { page: [item, item], post: [item, item] } }
 */
function getContentByLang(data) {
  let posts = [];
  let pages = [];
  let result = {};

  data.forEach(item => {
    const lang = item.lang || 'all';
    result[lang] || (result[lang] = {});
    result[lang][item.layout] || (result[lang][item.layout] = []);
    result[lang][item.layout].push(item);
  });

  return result;
}
