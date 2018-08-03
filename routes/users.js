const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const password = require('passport');

//load User model
require('../models/User');
const User = mongoose.model('users');

//user login route
router.get('/login', (req, res) => {
    res.render('users/login');
});

//user login route
router.get('/register', (req, res) => {
    res.render('users/register');
});

//register form POST
router.post('/register', (req, res) => {
    let errors =[];
    if(req.body.password != req.body.password2){
        errors.push({text: 'Passwords do not match'});
    }
    if(req.body.password.length < 4){
        errors.push({text: 'Password must be at least 4 characters'})
    }
    if(errors.length > 0){
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    }else{
        //check if a user with that email already exists
        User.findOne({email: req.body.email})
        .then(user =>{
            //if user exists
            if(user){
                req.flash('errorMessage', 'Email already registered');
                res.redirect('/users/login');
            }else{
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                //hash password with brcrpyjs, from bcriptjs documentation on npm site
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) =>{
                        if(err) throw err;
                        newUser.password = hash;
                        //save user
                        newUser.save()
                        .then(user =>{
                            req.flash('successMessage', 'Successfully registered');
                            res.redirect('/users/login');
                        })
                        .catch(err => {
                            console.log(err);
                            return;
                        });
                    });
                });
            }
        });
    }
})

module.exports = router;