block('page').mod('layout', 'blog')(
  content()(function() {
    return [
      {
        elem: 'header',
        content: {
          block: 'header'
        }
      },
      {
        elem: 'content',
        content: this.ctx.content
      },
      this._paginatable && {
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
      },
      this.ctx.scripts
    ];
  })
);
