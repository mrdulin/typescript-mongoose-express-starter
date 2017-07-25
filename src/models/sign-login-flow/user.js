/**
 * Created by Administrator on 2016/4/7.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var SALT_FACTOR = 10;
var noop = function() {};

var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    displayName: String,
    bio: String
});

userSchema.pre('save', function(done) {
    var user = this;
    if(!user.isModified('password')) {
        return done();
    }
    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if(err) {return done(err);}
        bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
            if(err) {
                done(err);
            }
            user.password = hashedPassword;
            done();
        });
    });
});

userSchema.methods = {
    getName: getName,
    checkPassword: checkPassword
};

function checkPassword(guess, done) {
    bcrypt.compare(guess, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
}

function getName() {
    return this.displayName || this.username;
}

var User = mongoose.model('User', userSchema);

module.exports = User;