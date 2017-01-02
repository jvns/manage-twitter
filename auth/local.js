module.exports = function (passport, db) {
  
  var Strategy = require('passport-local').Strategy;
  // Configure the local strategy for use by Passport.
  //
  // The local strategy require a `verify` function which receives the credentials
  // (`username` and `password`) submitted by the user.  The function must verify
  // that the password is correct and then invoke `cb` with a user object, which
  // will be set at `req.user` in route handlers after authentication.
  passport.use(new Strategy(
    function(username, password, cb) {
      db.users.findByUsername(username, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        if (user.password != password) { return cb(null, false); }
        return cb(null, user);
      });
    }));
  
  return {
    routes: function(app) {
      app.post('/login', 
        passport.authenticate('local', { failureRedirect: '/login' }),
        function(req, res) {
          res.redirect('/');
        });
    }
  };
};