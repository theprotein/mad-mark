block('root')(
  def()(function() {
    const lang = this.ctx.lang;
    const i18n = this.ctx.i18n[lang];

    return applyCtx({
      block: 'page',
      title: i18n && i18n.title,
      mods: this.extend({}, this.mods),
      head: [
        { elem: 'css', url: '../css/index.min.css' }
      ],
      scripts: [
        { elem: 'js', url: '../js/index.min.js' }
      ],
      pagination: this.ctx.pagination,
      config: this.ctx.config,
      name: this.ctx.name,
      meta: this.ctx.meta,
      layout: this.ctx.layout,
      i18n: this.ctx.i18n,
      lang: this.ctx.lang,
      content: this.ctx.content
    });
  })
);
