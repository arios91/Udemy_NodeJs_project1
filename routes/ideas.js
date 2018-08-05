const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//bring in authenticated helper
const {ensureAuthenticated} = require('../helpers/auth');

//load idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//ideas index route, add authentica helper in parameters
router.get('/', ensureAuthenticated, (req, res) => {
    //call db to get Idea, returns a promise
    Idea.find({user: req.user.id})
    .sort({date:'desc'})
    .then(ideas => {
        res.render('ideas/index', {
            ideas: ideas
        });
    })
})

//add idea form, add authentica helper in parameters
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
})

//edit idea form, add authentica helper in parameters
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    //need to fetch idea by id
    Idea.findOne({
        _id: req.params.id,
    })
    .then(idea =>{
        //if idea does not belong to user, kick them out
        if(idea.user != req.user.id){
            req.flash('errorMessage', 'Not authorized to edit this idea');
            res.redirect('/ideas');
        }else{
            res.render('ideas/edit', {
                idea: idea
            });
        }
    })
})

//process form, add authentica helper in parameters
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];
    if(!req.body.title){
        errors.push({text:'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text:'Please add some details'});
    }
    if(errors.length > 0){
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details,
        })
    }else{
        const newIdea = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        //returns a promise
        new Idea(newIdea)
        .save()
        .then(idea => {
            req.flash('successMessage', 'Successfully added idea');
            res.redirect('/ideas');
        })
    }
});

//edit form process, add authentica helper in parameters
router.put('/:id', ensureAuthenticated, (req,res) =>{
    //returns a promise
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        //change to new values
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
        .then(idea => {
            req.flash('successMessage', 'Successfully edited idea');
            res.redirect('/ideas');
        })
    })
});

//delete idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({
        _id: req.params.id
    })
    .then(() => {
        req.flash('successMessage', 'Successfully deleted idea');
        res.redirect('/ideas');
    })
});


module.exports = router;