block('tags')(
  content()(function() {
    const tags = applyNext();

    return tags && tags.map(function(tag, idx) {
      return [
        {
          block: 'link',
          url: 'tag-' + tag + '.' + this._lang + '.html',
          content: tag
        },
        tags.length > idx + 1 ? ', ' : ''
      ];
    }, this);
  })
);
