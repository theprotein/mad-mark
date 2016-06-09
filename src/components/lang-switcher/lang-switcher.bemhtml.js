block('lang-switcher')(
  content()(function () {
    return this.ctx.langs.map(lang => ({
      elem: 'link',
      elemMods: { current: lang.current },
      url: lang.url,
      content: lang.lang
    }))
  })
);
