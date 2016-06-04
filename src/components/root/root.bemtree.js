block('root').def()(function() {
  var ctx = this.ctx,
    data = this.bb = this._data = ctx.data,
    meta = data.meta || {};

  this._lang = ctx.lang;
  this._title = ctx.title;
  this._subtitle = ctx.subtitle;
  this._pagination = ctx.pagination;

  var mods = this.mods,
    layout = mods.layout,
    title = (meta.title ? meta.title + ' — ' : '') + ctx.title || '';

  return applyCtx({
    block: 'page',
    title: title,
    mods: { layout: layout },
    head: [
      { elem: 'css', url: '../css/index.min.css' }
    ],
    scripts: [
      { elem: 'js', url: '../js/index.min.js' }
    ]
  });
});
