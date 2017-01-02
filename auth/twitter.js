module.exports = function(passport, db) {
  
  var Strategy = require('passport-twitter').Strategy,
      path = '/login/twitter',
      returnPath = path + '/return';
  
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
      console.log(profile);
      db.users.findOrCreate(profile, function (err, user) {
        return cb(err, user);
      });
    }));

  return {
    routes: function(app) {
      
      app.get(path,
        passport.authenticate('twitter'));
      
      app.get(returnPath, 
        passport.authenticate('twitter', { failureRedirect: '/login' }),
        function(req, res) {
          res.redirect('/');
        });
    }
  };
};