var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imagen_schema = new Schema({
  title:{type:String, required: true},
  extension:{type: String, required:true},
  creator:{type: Schema.Types.ObjectId, ref: "Register"}
});

var imagen = mongoose.model("imagen", imagen_schema);

module.exports = imagen;
