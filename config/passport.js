const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//load models
const User = mongoose.model('users');

module.exports = function(passport){
    passport.use(new LocalStrategy({
        usernameField: 'email'
    },(email, password, done) =>{
        //get user
        User.findOne({
            email: email
        })
        .then(user =>{
            //if user not found, return error
            if(!user){
                return done(null, false, {message: 'User not found'});
            }
            //Match passed in password to hashed password stored in user
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch){
                    //passwords matched, return user
                    return done(null, user)
                }else{
                    //passwords don't match
                    return done(null, false, {message: 'Password incorrect'});
                }
            })
        })
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        })
    });
}