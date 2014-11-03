var fs = require('fs'),
    path = require('path'),
    glob = require('glob'),
    marked = require('meta-marked'),

    config = require('./content/config.json'),
    outputFolder = config.outputFolder || 'output',
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

fs.mkdir(outputFolder, function(err) {
    if (err && err.code != 'EEXIST') throw new Error(err);

    fs.writeFile(path.join(outputFolder, 'data.json'),
        JSON.stringify(results), function(err) {
            if (err) throw new Error(err);
        });
});
