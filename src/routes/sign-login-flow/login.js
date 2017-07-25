var express = require('express'),
	router = express.Router(),
	passport = require('passport');

router.route('/')
	.get(function (req, res, next) {
		res.render("./sign-login-flow/login");
	})
	.post(passport.authenticate("login", {
		successRedirect: "/sign-login-flow",
		failureRedirect: "/sign-login-flow/login",
		failureFlash: true
	}))

module.exports = router;
