block('header').content()(function() {
  return [
    {
      block: 'avatar',
      url: this.bb.avatar
    },
    applyNext()
  ];
});
