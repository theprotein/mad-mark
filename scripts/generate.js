'use strict';

const path = require('path');
const fs = require('fs');
const {BEMTREE} = require('../bundles/index/index.bemtree.js');
const {BEMHTML} = require('../bundles/index/index.bemhtml.js');

var config = require('../src/content/config.json'),
    outputFolder = 'dist',
    i18n = require('../src/content/i18n.json'),
    data = require('../' + outputFolder + '/data.json'),
    langs = data.reduce(function(prev, cur) {
      prev.indexOf(cur.lang) < 0 && prev.push(cur.lang);
      return prev;
    }, []),
    tags = data.reduce(function(prev, cur) {
      cur.meta && cur.meta.tags && cur.meta.tags.forEach(function(tag) {
        prev[cur.lang] = prev[cur.lang] || [];
        prev[cur.lang].indexOf(tag) < 0 && prev[cur.lang].push(tag);
      });

      return prev;
    }, {}),
    user = config.users[0];

// TODO: подумать, не генерировать ли такую структуру изначально
function getContentByLang(data) {
    // возвращает контент в виде {
    //     en: {
    //         page: [item, item],
    //         post: [item, item]
    //     }
    // }
    var posts = [],
      pages = [],
      result = {};

    data.forEach(function(item) {
      var lang = item.lang || 'all';
      result[lang] || (result[lang] = {});
      result[lang][item.type] || (result[lang][item.type] = []);
      result[lang][item.type].push(item);
    });

    return result;
}

langs.forEach(function(lang) {
    var langPosts = getContentByLang(data)[lang].post,
      langPages = getContentByLang(data)[lang].page;

    // генерация индексных страниц блога
    // бьем langPosts на массивы по config.postsPerPage айтемов в каждом
    var paginatedPosts = [],
      postsLength = langPosts.length,
      postsPerPage = config.postsPerPage;

    for (var i = 0, curPage = 0; i < postsLength; i++) {
      i > 0 && (i % postsPerPage == 0) && curPage++;
      // paginatedPosts[curPage] = paginatedPosts[curPage] || [];
      // paginatedPosts[curPage].push(langPosts[i]);
      paginatedPosts[curPage] = (paginatedPosts[curPage] || []).concat(langPosts[i]);
    }

    paginatedPosts.forEach(function(pageOfPosts, idx) {
      var totalPages = +(postsLength / postsPerPage).toFixed() +
                       (postsLength % postsPerPage ? 1 : 0);

      var bemjson = BEMTREE.apply({
        block: 'root',
        title: config.title && config.title[lang] || '',
        subtitle: config.subtitle && config.subtitle[lang] || '',
        data: pageOfPosts,
        lang: lang,
        user: user,
        pagination: {
          totalPages: totalPages,
          idx: idx,
          isLast: totalPages == idx + 1,
          needPagination: totalPages > 1
        }
      });

      var p = path.resolve('./' + outputFolder + '/blog' + (idx ? '-' + idx : '') + '.' + lang + '.html');
      fs.writeFileSync(p, BEMHTML.apply(bemjson));
    });

    // генерация страницы всех тегов
    // BEMTREE.apply({
    //     block: 'root',
    //     title: config.title[lang],
    //     mods: { type: 'tags' },
    //     lang: lang,
    //     i18n: i18n,
    //     content: tags[lang],
    //     data : {
    //         meta: {} // TODO: прокидывать данные для meta-тегов
    //     }
    // })
    // .then(function(bemjson) {
    //     var p = path.resolve('../' + outputFolder + '/tags.' + lang + '.html');
    //     fs.writeFileSync(p, BEMHTML.apply(bemjson));
    // });

    // генерация индексов по тегам
    tags[lang] && tags[lang].forEach(function(tag) {
      var p = path.resolve('./' + outputFolder + '/tag-'+ tag + '.' + lang + '.html');
      var bemjson = BEMTREE.apply({
        block: 'root',
        title: config.title && config.title[lang] || '',
        subtitle: config.subtitle && config.subtitle[lang] || '',
        data: langPosts.filter(function(post) {
          return post.meta && post.meta.tags && post.meta.tags.indexOf(tag) > -1;
        }),
        lang: lang,
        user: user
      });
      fs.writeFileSync(p, BEMHTML.apply(bemjson));
    });

    // генерация каждой конкретной страницы
    langPages.concat(langPosts).forEach(function(page) {
      page.meta = page.meta || {};

      var bemjson = BEMTREE.apply({
        block: 'root',
        title: config.title && config.title[lang] || '',
        subtitle: config.subtitle && config.subtitle[lang] || '',
        data: page,
        lang: lang,
        user: user
      });

      fs.writeFileSync(path.join(outputFolder, page.fileName.split('.')[0] + '.' + lang + '.html'), BEMHTML.apply(bemjson));
    });
});
