var express = require('express');
var router = express.Router();

router.route('/')
    .get(ensureAuthenticated, function (req, res) {
        res.render("./sign-login-flow/edit");
    })
    .post(ensureAuthenticated, function (req, res, next) {
        req.user.displayName = req.body.displayname;
        req.user.bio = req.body.bio;
        req.user.save(function (err) {
            if (err) {
                next(err);
                return;
            }
            req.flash("info", "Profile updated!");
            res.redirect("/sign-login-flow/edit");
        });
    })

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("info", "You must be logged in to see this page.");
        res.redirect("/sign-login-flow/login");
    }
}

module.exports = router;