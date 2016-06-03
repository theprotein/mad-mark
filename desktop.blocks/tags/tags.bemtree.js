block('tags').content()(function() {
  var tags = applyNext();
  return tags.map(function(tag, idx) {
    return [
      {
        block: 'link',
        url: 'tag-' + tag + '.' + this._lang + '.html',
        content: tag
      },
      tags.length > idx + 1 ? ', ' : ''
    ];
  }, this);
});
