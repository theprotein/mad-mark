var fs = require('fs'),
    glob = require('glob'),
    marked = require('meta-marked'),

    mdFiles = glob.sync('content/*/*.md');

var results = mdFiles.map(function(file) {
    var parsed = marked(fs.readFileSync(file, 'utf-8'));

    return {
        fileName: file.split('/').reverse()[0],
        type: file.indexOf('/pages/') > -1 ? 'page' : 'post',
        path: file,
        lang: file.split('.').reverse()[1],
        meta: parsed.meta,
        content: parsed.html
    };
});

fs.writeFileSync('output/data.json', JSON.stringify(results));
