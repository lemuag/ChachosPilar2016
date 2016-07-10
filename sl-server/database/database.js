/**
* @author Ismael Rodríguez Hernández
* Este módulo contiene funciones para conectar a una BD MongoDB de eventos.
*/



var Fav = require("./models/mongodb.js").Fav;
var Session = require("./models/mongodb.js").Session;

function addSession(uuid){

  var session = new Session({uuid:uuid,timestamp:Date.now()});
  return session.save();
}

function getFav(eventId){
  return Fav.findOne({_id:eventId})
  .then(function(response){
    if(response==null){
      return {"_id":parseInt(eventId),"count":0};
    }
    return response;
  });
}

function addFav(eventId){

  var conditions = { _id: eventId }
  , update = { $inc: { count: 1 }}
  , options = { multi: false , upsert: true};

  return Fav.update(conditions, update, options);
}


function removeFav(eventId){


  return Fav.findOne({_id:eventId})
  .then(function(response){
    var fav = response;
    console.log(fav);
    if(fav.count>0){
      fav.count--;
    }
    return fav.save();

  })
  .catch(function(error){
    console.log(error);
    return error;
  })

}

//Devuelve un número "limit" de números de eventos ordenados por popularidad.
function retrieveMostPopular(limit){

  return Fav
  .find({})
  .sort({'count': -1})
  .limit(limit)
  .exec();

}
exports.getFav = getFav;
exports.addFav = addFav;
exports.removeFav = removeFav;
exports.retrieveMostPopular = retrieveMostPopular;
exports.addSession = addSession;
