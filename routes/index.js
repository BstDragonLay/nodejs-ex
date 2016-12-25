var express = require('express');
var router = express.Router();
//connect to the db
var Register = require('../models/users').Register;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'app' });
});
//Register Database
router.get('/register', function(req, res, next) {
  res.render('register',{
  	message: "error en la pagina"
  });
});
router.post('/register', function(req, res, next){
  var items = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  };
  var data = new Register(items);
  data.save();
  res.redirect('/');
});

//Login Database
router.get("/login", function(req, res, next){
  res.render("login");
});
router.post('/login', function(req, res){
	Register.findOne({name:req.body.name, password: req.body.password}, function(err, user){
		if(err){
			console.log(String(err));

		}
		req.session.user_id = user._id;
		res.redirect('/app');
	});

});


module.exports = router;
