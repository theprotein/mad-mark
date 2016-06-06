block('root')(
  def()(function() {
    const lang = this.ctx.lang;
    const i18n = this.ctx.i18n[lang];
    const assetsRelative = this.ctx.layout === 'root' ? '.' : '..';

    return applyCtx({
      block: 'page',
      title: i18n && i18n.title,
      mods: this.extend({}, this.mods),
      styles: [
        { elem: 'css', url: `${assetsRelative}/css/styles.min.css` }
        // TODO: add vendors from config
      ],
      scripts: [
        { elem: 'js', url: `${assetsRelative}/js/scripts.min.js` }
        // TODO: add vendors from config
      ],
      pagination: this.ctx.pagination,
      tags: this.ctx.tags,
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
