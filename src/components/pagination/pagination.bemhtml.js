block('pagination')(
  content()(function () {
    // TODO: require i18n
    return [
      this._pagination.idx ? {
        block: 'link',
        url: 'blog' + (this._pagination.idx - 1 ? '-' + (this._pagination.idx - 1) : '') + '.' + this._lang + '.html',
        content: isRussian ? 'Предыдущие посты' : 'Previous'
      } : '',
      this._pagination.isLast ? '' : {
        block: 'link',
        url: 'blog-' + (this._pagination.idx + 1)  + '.' + this._lang + '.html',
        content: isRussian ? 'Следующие посты' : 'Next'
      }
    ];
  })
);
