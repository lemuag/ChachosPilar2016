/**
* @author Ismael Rodríguez Hernández
* Este archivo define un router que se encarga de definir los endpoint REST
* para los eventos.
*/
var express = require('express');
var router = express.Router();
var database = require('../database/database.js');
var RateLimit = require('express-rate-limit');
var nodemailer = require('nodemailer');
fs = require('fs');

var transporter = nodemailer.createTransport({
       service: 'Gmail',
       auth: {
           user: '', // Your email id
           pass: '' // Your password
       }
   });

var sendWarningMail = function(req,res,next){


     var mailOptions = {
        from: 'irwid.feather@gmail.com', // sender address
        to: 'ismaro.394@gmail.com', // list of receivers
        subject: 'Alerta, intento de hack en el servidor', // Subject line
        text: "IP: " + req.ip  + ", method: " + req.method + ", path:  " + req.path//, // plaintext body
    };

    transporter.sendMail(mailOptions, function(error, info){});

    //Dar respuesta, ya se enviará el correo
    res.status(429).send("Too many requests, please try again later.");

}

//Limitador de poner 20 favoritos cada hora
var favLimiter = new RateLimit({
  windowMs: 60*60*1000, // 1 hour
  max: 20,
  delayMs: 0,
  handler: sendWarningMail
});


//Limitador de quitar 20 favoritos cada hora
var unfavLimiter = new RateLimit({
  windowMs: 60*60*1000, // 1 hour
  max: 20,
  delayMs: 0,
  handler: sendWarningMail
});


//Limitador de consulta de versión -> 5 cada minuto
var newSessionLimit = new RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 5, // limit each IP
  delayMs: 0 // disable delaying - full speed until the max limit is reached
});

//Limitador de actualizaciones de datos -> 20 archivos por minuto
var updateLimit = new RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 20, // limit each IP
  delayMs: 0 // disable delaying - full speed until the max limit is reached
});

//Limitador de resto de consultas -> 60 por minuto
var queryLimit = new RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 60, // limit each IP
  delayMs: 0 // disable delaying - full speed until the max limit is reached
});



/**
* Obtención de la versión de los datos. Si error, da -1 para evitar problemas.
*/
router.get("/version",newSessionLimit,function(req,res){


  var uuid = req.query.uuid;
  if(!uuid){
    uuid = "unkwnown";
  }

  database.addSession(uuid); //Guardar que ha entrado (da igual que se guarde más adelante o no, asíncrono)

  //Se le devuelve al usuario el fichero de versión
  fs.readFile('data/version.json', 'utf8', function (err,data) {
    if (err) {
      return res.status(500).send({"version":-1});
    }
    return res.send(data);
  });

});

/**
* Obtención de los datos de un día concreto. En caso de error, da array
* vacío para evitar problemas.
*/
router.get("/day/:day",updateLimit,function(req,res){

  var day = parseInt(req.params.day);
  if(day>=8 && day<=15){
    fs.readFile('data/' + day+ '.json', 'utf8', function (err,data) {
      if (err) {
        return res.status(500).send([]);
      }
      return res.send(data);
    });
  }
  else{
    return res.status(400).send("Bad request");
  }

});

router.get("/popular/:limit",queryLimit,function(req,res){

  var limit = parseInt(req.params.limit);
  if(limit>0){
    database.retrieveMostPopular(limit)
    .then(function(success){
      return res.send(success);
    })
    .catch(function(error){
      return res.status(500).send("Internal server error");
    });
  }
  else{
    return res.status(400).send("Bad request");
  }
});

/**
* Obtiene el número de favoritos de evento concreto
*/
router.get("/fav/:eventId",queryLimit,function(req,res){

  var id = req.params.eventId;
  if(id>=800 && id <= 1600){
    database.getFav(id).
    then(function(success){
      return res.send(success);
    })
    .catch(function(error){
      return res.status(500).send("Internal server error");
    })
  }
  else{
    return res.status(400).send("Bad request");
  }





});

/**
 * Añade un favorito para evento concreto
*/
router.put("/fav/:eventId",favLimiter,function(req,res){

  database.addFav(req.params.eventId).
  then(function(success){
    return res.send("OK");
  })
  .catch(function(error){
    return res.status(500).send("Internal server error");
  })


});

/**
* Quita favorito para un evento concreto, pero solo hasta que tenga 0.
*/
router.delete("/fav/:eventId",unfavLimiter,function(req,res){

  database.removeFav(req.params.eventId).
  then(function(success){
    return res.send("OK");
  })
  .catch(function(error){
    return res.status(500).send("Internal server error");
  })


});







module.exports = router;
