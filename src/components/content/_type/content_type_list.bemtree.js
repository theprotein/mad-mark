block('content').mod('type', 'list').content()(function() {
  return this._data.map(function(post) {
    return [
      {
        block: 'post',
        content: [
          {
            tag: 'h2',
            content: {
              block: 'link',
              url: post.fileName.replace('md', 'html'),
              content: post.meta.title
            }
          },
          post.content,
          {
            block: 'tags',
            content: post.meta && post.meta.tags
          }
        ]
      }
    ];
  });
});
