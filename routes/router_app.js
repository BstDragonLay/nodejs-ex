var express = require('express');
var Imagen = require('../models/imagenes');
var router = express.Router();
var fs = require("fs");
var redis = require('redis');
//cliente de redis
//var client = redis.createClient();
//middleware to refactor find imagenes
var image_finder_middleware = require('./../middlewares/find_image');
/* GET users listing. */
router.get('/', function(req, res, next) {
  Imagen.find({})
        .populate("creator")
        .exec(function(err, imagenes){
          if(err) console.log(err);
            res.render('app/home',{imagenes:imagenes});
        })

});

/*Vistas*/
router.get('/imagenes/new', function(req, res){
  res.render('app/imagenes/new')
});
//middlewares
router.all("/imagenes/:id*", image_finder_middleware);

router.get('/imagenes/:id/edit', function(req, res){
      res.render("app/imagenes/edit");
});

/*REST*/

router.route("/imagenes/:id")
    .get(function(req,res){
          res.render("app/imagenes/show");
    })
    .put(function(req,res){
      res.locals.imagen.title = req.body.name;
      res.locals.imagen.save(function(err){
        if(!err){
          res.render("app/imagenes/show");
        }else {
          res.render("app/imagenes" + req.params.id +"/edit");
        }
      });
    })
    .delete(function(req,res){
      //eliminar
      Imagen.findOneAndRemove({_id: req.params.id}, function(err){
        if(!err){
          res.redirect("/app/imagenes");
        }else {
          console.log(err);
          res.redirect("/app/imagenes" + req.params.id);
        }
      })
    });
router.route("/imagenes")
      .get(function(req,res){
        Imagen.find({creator: res.locals.user._id}, function(err,imagenes){
          if(err){
            res.redirect("/app");
            return;
          }
          res.render("app/imagenes/index", {imagenes:imagenes});
        });
      })
      .post(function(req,res){
        var extension = req.body.archivo.name.split(".").pop();
        //console.log(req.body.archivo);
          var data = {
            title: req.body.name,
            creator: res.locals.user._id,
            extension: extension
          }
          var imagen = new Imagen(data);
          imagen.save(function(err){
            if(!err){
              fs.rename(req.body.archivo.path, "public/images/"+imagen._id+"."+ extension);
              res.redirect("/app/imagenes/" + imagen._id);
            }else{
              console.log(imagen);
              res.render(err);
            }

          })
      });




module.exports = router;
