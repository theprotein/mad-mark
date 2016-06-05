block('page')(
  def()(function() {
    return applyNext({
      _pagination: this.ctx.pagination,
      _title: this.ctx.title,
      _lang: this.ctx.lang,
      _mods: this.ctx.mods
    });
  })
);
