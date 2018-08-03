const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Idea');

//load idea model
const Idea = mongoose.model('ideas');

//ideas index route
router.get('/', (req, res) => {
    //call db to get Idea, returns a promise
    Idea.find({})
    .sort({date:'desc'})
    .then(ideas => {
        res.render('ideas/index', {
            ideas: ideas
        });
    })
})

//add idea form
router.get('/add', (req, res) => {
    res.render('ideas/add');
})

//edit idea form
router.get('/edit/:id', (req, res) => {
    //need to fetch idea by id
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea =>{
        res.render('ideas/edit', {
            idea: idea
        });
    })
})

//process form
router.post('/', (req, res) => {
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
            details: req.body.details
        })
    }else{
        const newIdea = {
            title: req.body.title,
            details: req.body.details
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

//edit form process
router.put('/:id', (req,res) =>{
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
router.delete('/:id', (req, res) => {
    Idea.remove({
        _id: req.params.id
    })
    .then(() => {
        req.flash('successMessage', 'Successfully deleted idea');
        res.redirect('/ideas');
    })
});


module.exports = router;