block('page').mod('layout', 'root')(
  content()(function() {
    return [
      {
        elem: 'header',
        content: {
          block: 'header',
          content: this._multilang && {
            block: 'lang-switcher'
          }
        }
      },
      {
        elem: 'content',
        content: this.ctx.content
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
