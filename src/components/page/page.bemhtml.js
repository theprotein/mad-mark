block('page')(
  def()(function() {
    // get this data in any place and any template from this._*
    return applyNext({
      _pagination: this.ctx.pagination,
      _config: this.ctx.config,
      _name: this.ctx.name,
      _meta: this.ctx.meta,
      _layout: this.ctx.layout,
      _i18n: this.ctx.i18n,
      _lang: this.ctx.lang,
      _mods: this.ctx.mods
    });
  })
);
