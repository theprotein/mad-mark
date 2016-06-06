block('lang-switcher')(
  content()(function () {
    return this._config.langs.map(lang => ([
      {
        block: 'link',
        url: '#',
        content: lang
      },
      '&nbsp;'
    ]));
  })
);
