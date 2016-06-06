block('page')(

  def()(function() {
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
  }),

  content()(function () {
    // default layout
    return [
      {
        elem: 'content',
        content: this.ctx.content
      },
      this.ctx.scripts
    ];
  })
);
