const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/checkAuth");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/error", (req, res) => {
  res.status(403).send(`"Error 403 <a href='/'>Back</a>"`);
});

//only if next is called, will u render dashboard
router.get("/home", ensureAuthenticated, (req, res) => {
  res.render("home");
});

module.exports = router;
