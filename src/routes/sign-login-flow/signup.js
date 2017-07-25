var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require(__base + 'models/sign-login-flow/user');

router
    .route('/')
    .get(function(req, res, next) {
         res.render('./sign-login-flow/signup');
    })
    .post(function (req, res, next) {
        var username = req.body.username;
        var password = req.body.password;

        User.findOne({username: username}, function (err, user) {
            if (err) return next(err);
            if (user) {
                req.flash('error', 'User already exists');
                return res.redirect('/sign-login-flow/signup');
            }

            var newUser = new User({
                username: username,
                password: password
            });

            newUser.save(function (err, newUserSelf, numAffected) {
                if (err) return next(err);
                console.log(numAffected);
                next();
            });
        });
    }, passport.authenticate('login', {
        successRedirect: '/sign-login-flow',
        failureRedirect: '/sign-login-flow/signup',
        failureFlash: true
    }))

module.exports = router;