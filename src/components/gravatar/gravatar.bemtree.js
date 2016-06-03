block('root').mode('plugins')(function() {
  var plugins = applyNext() || {},
    user = this.ctx.user,
    gravatarHash = require('crypto').createHash('md5').update(user.email, 'utf8').digest('hex');

  plugins.avatar = 'https://www.gravatar.com/avatar/' + gravatarHash + '?s=240&default=' + encodeURIComponent('path/To/Fallback/Photo'); // TODO: path/To/Fallback/Photo

  return plugins;
});
