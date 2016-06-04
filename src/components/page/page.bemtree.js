block('page')(
  content()(function() {
    return [{
      block: this.mods.layout,
      pagination: this._pagination
    }];
  })
);
