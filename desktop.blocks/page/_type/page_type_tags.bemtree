block('page').mod('type', 'tags').content()(function() {
    return this.ctx.content.map(function(tag) {
        return {
            block: 'link',
            url: 'tag-' + tag + this._lang + '.html',
            content: tag
        };
    });
});
