/**
* @author Ismael Rodríguez Hernández
* Servidor San Lorenzo 2016.
*/
var express = require("express");
var bodyParser = require("body-parser");
var compression = require('compression');
var app = express();
var router = express.Router();
var morgan = require('morgan')
var fs = require('fs');
var path = require('path');
var cors = require('cors');


//Cors
app.use(cors());

// Poner en marcha morgan para que loguee las peticiones a access.log
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}))

//Se usa compresión GZIP para reducir los datos usados
app.use(compression());

//Aceptaremos JSON y valores codificados en la propia URL
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Puesta en marcha de "events"
app.use("/events",require('./routes/events.js'));

function start(port){
  var server = app.listen(port,function(){
    console.log("API Express server listening on port %s...",server.address().port);
  });
}

exports.start = start;
