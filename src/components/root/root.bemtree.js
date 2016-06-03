block('root').def()(function() {
  var ctx = this.ctx,
    data = this.bb = this._data = ctx.data,
    meta = data.meta || {};

  this._lang = ctx.lang;
  this._title = ctx.title;
  this._subtitle = ctx.subtitle;
  this._pagination = ctx.pagination;

  // применяем плагины
  this.bb = this.extend(this.bb, apply('plugins'));

  var mods = this.mods,
    pageType = mods.type,
    title = (meta.title ? meta.title + ' — ' : '') + ctx.title || '';

  if(pageType === 'tags') {
    title = ctx.i18n[this._lang].tags + ' — ' + ctx.title; // TODO: capitalize
  }

  return applyCtx({
    block: 'page',
    title: title,
    mods: { type: pageType },
    head: [
      { elem: 'css', url: 'index.min.css' }
    ],
    scripts: [
      { elem: 'js', url: 'index.min.js' }
    ]
  });
});
