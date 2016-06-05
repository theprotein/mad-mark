block('page').mod('layout', 'simple')(
  content()(function() {
    return [
      {
        elem: 'header',
        content: {
          block: 'header',
          content: [
            {
              tag: 'h1',
              content: this._title
            },
            {
              block: 'lang-switcher'
            }
          ]
        }
      },
      {
        elem: 'content',
        content: applyNext()
      },
      this._pagination && this._pagination.needPagination && {
        elem: 'pagination',
        content: {
          block: 'pagination'
        }
      },
      {
        elem: 'footer',
        content: {
          block: 'footer'
        }
      }
    ];
  })
);
