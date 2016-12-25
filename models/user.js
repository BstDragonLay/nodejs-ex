var mongodb = require('mongodb');
var mongoose = require('mongoose');
//schema
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  password: {type: String, required: true}
}, {collection: 'UserRegister'});
var User = mongoose.model('User', userSchema);

module.exports = User;
