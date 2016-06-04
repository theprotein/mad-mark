'use strict';

const {join, resolve} = require('path');
const fs = require('bluebird').promisifyAll(require('fs-extra'));

module.exports = function (userConfig, INPUT, OUTPUT) {
  const {BEMTREE} = require(join(OUTPUT, 'bundles', 'index', 'index.bemtree.js'));
  const {BEMHTML} = require(join(OUTPUT, 'bundles', 'index', 'index.bemhtml.js'));

  const i18n = require(join(INPUT, 'i18n.json'));
  const data = require(join(OUTPUT, 'data.json'));
  const tags = getTags(data);
  const user = userConfig.users[0];

  userConfig.langs.forEach(lang => {
    const contentByLang = getContentByLang(data)[lang];

    Object.keys(contentByLang).forEach(layout => {
      const contentByLayout = contentByLang[layout];

      const paginate = userConfig.layouts[layout] && userConfig.layouts[layout].paginate;
      if (paginate) {
        let paginatedPosts = [];
        let totalPages = calcPages(contentByLayout.length, paginate);

        for (let i = 0, curPage = 0; i < contentByLayout.length; i++) {
          i > 0 && (i % paginate == 0) && curPage++;
          paginatedPosts[curPage] = (paginatedPosts[curPage] || []).concat(contentByLayout[i]);
        }

        paginatedPosts.forEach((page, idx) => {
          const bemjson = BEMTREE.apply({
            block: 'root',
            mods: { layout: layout },
            title: userConfig.title && userConfig.title[lang] || '',
            subtitle: userConfig.subtitle && userConfig.subtitle[lang] || '',
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

          const pagePath = join(OUTPUT, layout, `index${resolvePageNum(idx)}${resolveLang(lang, userConfig)}.html`);
          fs.outputFileSync(pagePath, BEMHTML.apply(bemjson));
        });
      }

      contentByLayout.forEach(page => {
        page.meta = page.meta || {};

        const bemjson = BEMTREE.apply({
          block: 'root',
          mods: { layout: layout },
          title: userConfig.title && userConfig.title[lang] || '',
          subtitle: userConfig.subtitle && userConfig.subtitle[lang] || '',
          data: page,
          lang: lang,
          user: user
        });

        const pagePath = join(OUTPUT, layout, `${page.name}${resolveLang(lang, userConfig)}.html`);
        fs.outputFileSync(pagePath, BEMHTML.apply(bemjson));
      });

      tags[lang] && tags[lang].forEach(tag => {
        const bemjson = BEMTREE.apply({
          block: 'root',
          mods: { layout: 'tags' },
          title: userConfig.title && userConfig.title[lang] || '',
          subtitle: userConfig.subtitle && userConfig.subtitle[lang] || '',
          data: contentByLayout.filter(post => (
            post.meta && post.meta.tags && post.meta.tags.indexOf(tag) > -1
          )),
          lang: lang,
          user: user
        });

        const pagePath = join(OUTPUT, 'tags', `tag-${tag}.${lang}.html`);
        fs.outputFileSync(pagePath, BEMHTML.apply(bemjson));
      });

    });

  });
}

function resolvePageNum(idx) {
  return idx ? `-${idx}` : '';
}

function resolveLang(lang, config) {
  return lang === config.defaultLang ? '' : `.${lang}`;
}

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
