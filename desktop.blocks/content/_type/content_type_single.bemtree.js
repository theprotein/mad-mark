block('content').mod('type', 'single').content()(function() {
    return [
        this._data.meta && this._data.meta.title ? {
            tag: 'h2',
            content: this._data.meta.title
        } : '',
        {
            block: 'post',
            content: this._data.content
        }
    ];
});
