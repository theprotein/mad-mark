var path = require('path'),
    fs = require('fs'),
    vm = require('vm'),
    pathToBundle = path.join('desktop.bundles', 'index'),
    bemtreeTmpl = fs.readFileSync(path.join(pathToBundle, 'index.bemtree.js')),
    ctx = vm.createContext({
        console: console,
        Vow: require('./libs/bem-core/common.blocks/vow/vow.vanilla.js')
    });

    vm.runInContext(bemtreeTmpl, ctx);

var config = require('./content/config.json'),
    outputFolder = config.outputFolder || 'output',
    i18n = require('./content/i18n.json'),
    data = require('./' + outputFolder + '/data.json'),
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
    bemhtml = require('./' + pathToBundle + '/index.bemhtml.js').BEMHTML,
    user = config.users[0],
    gravatarHash = require('crypto').createHash('md5').update(user.email, 'utf8').digest('hex');

user.avatar = 'https://www.gravatar.com/avatar/' + gravatarHash + '?s=240&default=' + encodeURIComponent('path/To/Fallback/Photo'); // TODO: path/To/Fallback/Photo

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
            title: config.title && config.title[lang] || '',
            subtitle: config.subtitle && config.subtitle[lang] || '',
            data: pageOfPosts,
            lang: lang,
            user: user,
            pagination: {
                totalPages: total,
                idx: idx,
                isLast: total == idx + 1,
                needPagination: total > 1
            }
        })
        .then(function(bemjson) {
            var p = path.resolve('./' + outputFolder + '/blog' + (idx ? '-' + idx : '') + '.' + lang + '.html');
            fs.writeFileSync(p, bemhtml.apply(bemjson));
        });
    });

    // генерация страницы всех тегов
    // bemtree.apply({
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
    //     var p = path.resolve('./' + outputFolder + '/tags.' + lang + '.html');
    //     fs.writeFileSync(p, bemhtml.apply(bemjson));
    // });

    // генерация индексов по тегам
    tags[lang] && tags[lang].forEach(function(tag) {
        bemtree.apply({
            block: 'root',
            title: config.title && config.title[lang] || '',
            subtitle: config.subtitle && config.subtitle[lang] || '',
            data: langPosts.filter(function(post) {
                return post.meta && post.meta.tags && post.meta.tags.indexOf(tag) > -1;
            }),
            lang: lang,
            user: user
        })
        .then(function(bemjson) {
            var p = path.resolve('./' + outputFolder + '/tag-'+ tag + '.' + lang + '.html');
            fs.writeFileSync(p, bemhtml.apply(bemjson));
        });
    });

    // генерация каждой конкретной страницы
    langPages.concat(langPosts).forEach(function(page) {
        page.meta = page.meta || {};

        bemtree.apply({
            block: 'root',
            title: config.title && config.title[lang] || '',
            subtitle: config.subtitle && config.subtitle[lang] || '',
            data: page,
            lang: lang,
            user: user
        })
        .then(function(bemjson) {
            fs.writeFileSync(path.join(outputFolder, page.fileName.split('.')[0] + '.' + lang + '.html'), bemhtml.apply(bemjson));
        });
    });
});
