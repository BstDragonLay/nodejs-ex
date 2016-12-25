var Imagen = require('../models/imagenes');

module.exports = function(image, req, res){

  //true = tiene permiso
  //false = no tiene permiso
  if (req.method === "GET" && req.path.indexOf("edit") < 0 ) {
    //Ver imagen
    return true;
  }
  //imagenes que no son del propetario
  if(typeof image.creator == "undefined") return false;
  
  if(image.creator._id.toString() == res.locals.user._id){
    //ver imagen del mismo propetario
    return true;
  }
  return false;
}
