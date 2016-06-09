block('lang-switcher').elem('link')(
  elemMod('current', true)(
    tag()('span')
  ),
  elemMod('current', false)(
    tag()('a'),
    attrs()(function () {
      return {
        href: this.ctx.url,
        role: 'link'
      }
    })
  )
);
