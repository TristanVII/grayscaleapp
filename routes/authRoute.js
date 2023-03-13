const express = require("express");
const passport = require("../middleware/passport");
const sql = require("../controller/mysqlController");
const { forwardAuthenticated } = require("../middleware/checkAuth");

const router = express.Router();

//if user already logged in (session) forward /login to /dashboard /// avoid all after forwardAuth
router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

router.post(
  "/login",
  //   (req, res) => {
  //     console.log(req.body);
  //   }
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/error",
  })
);

router.post("/signup", (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  sql.createUser(username, password);
  res.redirect("/");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

module.exports = router;
