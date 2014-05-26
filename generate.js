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

var data = require('./data.json'),
    langs = data.reduce(function(prev, cur) {
        prev.indexOf(cur.lang) < 0 && prev.push(cur.lang);
        return prev;
    }, []),
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

    bemtree.apply({ block: 'root', data: langPosts }).then(function(bemjson) {
        console.log('bemjson', bemjson);
        var p = path.resolve('./' + pathToOutput + '/blog.' + lang + '.html');
        fs.writeFileSync(p, bemhtml.apply(bemjson));
    });

    langPages.forEach(function(page) {
        bemtree.apply({ block: 'root', data: page }).then(function(bemjson) {
            fs.writeFileSync(pathToOutput + '/' + page.fileName.split('.')[0] + '.' + lang + '.html', bemhtml.apply(bemjson));
        });
    });
});
