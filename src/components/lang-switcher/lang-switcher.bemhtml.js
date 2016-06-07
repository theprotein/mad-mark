block('lang-switcher')(
  content()(function () {
    const langs = this._config.langs;
    const mainLang = langs[0];
    const baseUrl = this._layout === 'root' ? '' : this._layout;  

    return this._config.langs.map(lang => ([
      {
        block: 'link',
        url: `/${baseUrl}/${this._name}${lang === mainLang ? '' : '.' + lang}.html`,
        content: lang
      },
      '&nbsp;'
    ]));
  })
);
