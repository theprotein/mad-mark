block('page')(

  def()(function() {
    this.ctx.styles = [].concat(this.ctx._css, this.ctx.vendors.css);
    this.ctx.scripts = [].concat(this.ctx._js, this.ctx.vendors.js);

    // get this data in any place and any template by this._*
    return applyNext({
      _tags: this.ctx.tags,
      _pagination: this.ctx.pagination,
      _paginatable: this._pagination && this._pagination.needPagination,
      _config: this.ctx.config,
      _multilang: this.ctx.config.langs.length > 1,
      _name: this.ctx.name,
      _meta: this.ctx.meta,
      _layout: this.ctx.layout,
      _i18n: this.ctx.i18n,
      _lang: this.ctx.lang,
      _mods: this.ctx.mods
    });
  })
);
