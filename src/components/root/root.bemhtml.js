block('root')(
  def()(function() {
    return applyCtx({
      block: 'page',
      title: this.ctx.title,
      mods: this.extend({}, this.mods),
      head: [
        { elem: 'css', url: '../css/index.min.css' }
      ],
      scripts: [
        { elem: 'js', url: '../js/index.min.js' }
      ],
      pagination: this.ctx.pagination,
      lang: this.ctx.lang,
      content: this.ctx.content
    });
  })
);
