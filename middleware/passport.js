const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const controller = require("../controller/mysqlController");

const localLogin = new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password",
  },
  //NAMES MATTER HERE HAVE TO MATCH NAMES FROM HTML FORM
  async (email, password, done) => {
    const user = await controller.authenticateUser(email, password);
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again",
        });
  }
);

//Creates session (runs only once --> moment user logins)
passport.serializeUser(function (user, done) {
  done(null, user.id);
  //done(null, user.id); should always be user.id (for performance and not to go in stale state)
});

//when refreshing page (if user already seriazlized) runs this function that looksup database to give back user
//user req.user
passport.deserializeUser(function (id, done) {
  controller.getUserById(id, (err, user) => {
    if (user) {
      done(null, user);
    } else {
      done({ message: "User not found" }, null);
    }
  });
});

module.exports = passport.use(localLogin);
