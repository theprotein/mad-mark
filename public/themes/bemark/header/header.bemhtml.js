block('header')(
  content()(function () {
    return [
      {
        tag: 'h1',
        content: this.ctx.title
      },
      this._multilang && {
        elem: 'multilang',
        content: {
          block: 'lang-switcher'
        }
      }
    ];
  })
);
