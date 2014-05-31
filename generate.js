var path = require('path'),
    fs = require('fs'),
    vm = require('vm'),
    pathToBundle = path.join('desktop.bundles', 'index'),
    pathToOutput = 'output',
    bemtreeTmpl = fs.readFileSync(pathToBundle + '/index.bemtree.js'),
    ctx = vm.createContext({
        console: console,
        Vow: require('./libs/bem-core/common.blocks/vow/vow.vanilla.js')
    });

    vm.runInContext(bemtreeTmpl, ctx);

var config = require('./content/config.json'),
    data = require('./content/data.json'),
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
    pages = data.filter(function(item) {
        return item.type == 'page';
    }),
    posts = data.filter(function(item) {
        return item.type == 'post';
    }),
    bemtree = ctx.BEMTREE,
    bemhtml = require('./' + pathToBundle + '/index.bemhtml.js').BEMHTML;

var filterByLang = function(items, lang) {
    return items.filter(function(item) {
        return item.lang == lang;
    });
};

langs.forEach(function(lang) {
    var langPosts = filterByLang(posts, lang),
        langPages = filterByLang(pages, lang);

    // генерация индексных страниц блога
    // бьем langPosts на массивы по config.postsPerPage айтемов в каждом
    var paginatedPosts = [],
        postsLength = langPosts.length,
        postsPerPage = config.postsPerPage;

    for (var i = 0, curPage = 0; i < postsLength; i++) {
        i > 0 && (i % postsPerPage == 0) && curPage++;
        paginatedPosts[curPage] = paginatedPosts[curPage] || [];
        paginatedPosts[curPage].push(langPosts[i]);
    }

    paginatedPosts.forEach(function(pageOfPosts, idx) {
        var total = +(postsLength / postsPerPage).toFixed() +
                    (postsLength % postsPerPage ? 1 : 0);

        bemtree.apply({
            block: 'root',
            title: config.title[lang],
            data: pageOfPosts,
            lang: lang,
            pagination: {
                totalPages: total,
                idx: idx,
                isLast: total == idx + 1,
                needPagination: total > 1
            }
        })
        .then(function(bemjson) {
            var p = path.resolve('./' + pathToOutput + '/blog' + (idx ? '-' + idx : '') + '.' + lang + '.html');
            fs.writeFileSync(p, bemhtml.apply(bemjson));
        });
    });

    // генерация индексов по тегам
    tags[lang].forEach(function(tag) {
        bemtree.apply({
            block: 'root',
            title: config.title[lang],
            data: langPosts.filter(function(post) {
                return post.meta && post.meta.tags && post.meta.tags.indexOf(tag) > -1;
            }),
            lang: lang
        })
        .then(function(bemjson) {
            var p = path.resolve('./' + pathToOutput + '/tag-'+ tag + '.' + lang + '.html');
            fs.writeFileSync(p, bemhtml.apply(bemjson));
        });
    });

    // генерация каждой конкретной страницы
    langPages.concat(langPosts).forEach(function(page) {
        page.meta = page.meta || {};

        bemtree.apply({
            block: 'root',
            title: config.title[lang],
            data: page,
            lang: lang
        })
        .then(function(bemjson) {
            fs.writeFileSync(pathToOutput + '/' + page.fileName.split('.')[0] + '.' + lang + '.html', bemhtml.apply(bemjson));
        });
    });
});
