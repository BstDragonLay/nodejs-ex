var express = require('express');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var UserRegister = require('../models/user').UserRegister;
var router = express.Router();

router.get('/', function(req, res, next){
  res.render('index', {title: 'APP'});
});
//register
router.post('/register', function(req, res, next){
  var items = {
    name: req.body.name,
    password: req.body.password
  };
  var data = new UserRegister(items);
  data.save();
  res.redirect('/')
});
//update
router.get('/get-data', function(req, res, next){
  UserRegister.find()
              .then(function(doc){
                res.render('index', {items: doc});
            });
});


module.exports = router;
