block('page')(

  def()(function() {
    this.ctx.styles = [].concat(this.ctx._css, this.ctx.vendors.css);
    this.ctx.scripts = [].concat(this.ctx._js, this.ctx.vendors.js);
    this.ctx.head = [];

    const langs = this.ctx.config.langs;
    let multilang;

    if (langs.length > 1) {
      multilang = [];
      const mainLang = langs[0];
      const baseUrl = this.ctx.layout === 'root' ? '' : '/' + this._layout;

      this.ctx.config.langs.forEach((lang) => {
        const url = `${baseUrl}/${this.ctx.name}${lang === mainLang ? '' : '.' + lang}.html`;
        this.ctx.head.push({ tag: 'link', attrs: { rel: 'alternate', href: url, hreflang: lang } });
        multilang.push({ lang, url, default: lang === mainLang, current: lang === this.ctx.lang });
      });
    }

    // get this data in any place and any template by this._*
    return applyNext({
      _tags: this.ctx.tags,
      _pagination: this.ctx.pagination,
      _paginatable: this._pagination && this._pagination.needPagination,
      _config: this.ctx.config,
      _multilang: multilang,
      _name: this.ctx.name,
      _meta: this.ctx.meta,
      _layout: this.ctx.layout,
      _i18n: this.ctx.i18n,
      _lang: this.ctx.lang,
      _mods: this.ctx.mods,
      _data: this.ctx.data
    });
  })
);
