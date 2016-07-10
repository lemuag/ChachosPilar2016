/**
* @author Ismael Rodríguez Hernández, 587429
* Este módulo define y compila los esquemas usados con Mongoose.
*/
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/sl16');

var favSchema = mongoose.Schema({
  _id: Number,
  count: Number
});

var sessionSchema = mongoose.Schema({
  uuid: String,
  timestamp: Date
});


module.exports = {
  Fav: mongoose.model('Fav',favSchema),
  Session: mongoose.model('Session',sessionSchema)
}
