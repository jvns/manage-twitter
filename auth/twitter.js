var OAuth = require('oauth');



module.exports = function(passport, db) {
  var secrets = {};
  var Strategy = require('passport-twitter').Strategy,
      path = '/login/twitter',
      returnPath = path + '/return';
function savedOauthGet(url, profile, callback) {
    var oauth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    process.env.TWITTER_CONSUMER_KEY,
    process.env.TWITTER_CONSUMER_SECRET,
    '1.0A',
    process.env.PROJECT_URL + '/login/twitter/return',
    'HMAC-SHA1'
);
    db.sqlite.findById(profile.id, function(err, user) {
          oauth.get(
        "https://api.twitter.com/1.1/" + url,
        user.token,
        user.tokenSecret,
        function(error, data, res) {
          if(error) {
            console.log(require('sys').inspect(res));
            console.log(require('sys').inspect(error));
            console.log(data);
          }
          else {
            callback(data);
          }
        }
      )
    });


}

  // Configure the Facebook strategy for use by Passport.
  //
  // OAuth 2.0-based strategies require a `verify` function which receives the
  // credential (`accessToken`) for accessing the Facebook API on the user's
  // behalf, along with the user's profile.  The function must invoke `cb`
  // with a user object, which will be set at `req.user` in route handlers after
  // authentication.
  passport.use(new Strategy({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.PROJECT_URL + returnPath,
      // your app needs explicit permission from Twitter to actually get an email back
      // see https://dev.twitter.com/rest/reference/get/account/verify_credentials
      includeEmail: true,
      // Twitter returns plenty of info if you want it
      includeStatus: false,
      includeEntities: false
    },
    function(token, tokenSecret, profile, cb) {
      secrets.token = token;
      secrets.tokenSecret = tokenSecret;
      secrets.oauth = this._oauth;
      console.log(this._oauth);
      db.sqlite.findOrCreate(profile, token, tokenSecret, function (err, user) {
        return cb(err, user);
      });
    }));

  return {
    secrets: secrets,
    get: function (url, callback) {
      if (!this.secrets.oauth) {
        // todo: hardcoded id here, get the real profile from the session somehow
        return savedOauthGet(url, {id: 6603532}, callback);
      }
      this.secrets.oauth.get(
        "https://api.twitter.com/1.1/" + url,
        this.secrets.token,
        this.secrets.tokenSecret,
        function(error, data, res) {
          if(error) {
            console.log(require('sys').inspect(res));
            console.log(require('sys').inspect(error));
            console.log(data);
          }
          else {
            callback(data);
          }
        }
      )},
    routes: function(app) {

      app.get(path,
        passport.authenticate('twitter')
      );

      app.get(returnPath,
        passport.authenticate('twitter', { failureRedirect: '/login/twitter' }),
        function(req, res) {
          res.redirect('/');
        });
    }
  };
};
