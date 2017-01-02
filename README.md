# Passport.js User Authentication
This demonstrates using [Passport.js](http://passportjs.org/) for user authentication.

The app allows you to login using built-in users (db/users.js) or login with Facebook/Twitter/etc. You can add many other social login providers easily - search for Strategies on http://passportjs.org.

The app is based on the [local](https://github.com/passport/express-4.x-local-example) and [Facebook](https://github.com/passport/express-4.x-facebook-example) examples.

![](https://cdn.hyperdev.com/0d184ee3-fd8d-4b94-acf4-b4e686e57375%2FpassportJSGIF.gif)

# Getting Started
To configure OAuth providers with your own app, see the provider's developer docs to create your own app, then stick your secrets in `.env`.

Callback URLs to use with third-party login providers end with /login/provider/return e.g. /login/twitter/return.

Note that users and sessions are just stored in memory in this example, so you'll want to add a datastore of some form.