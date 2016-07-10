
/**
 * Servicio para la gestión de la carga de eventos y listas de eventos.
 *
 * Copyright (C) <2016> <Ismael Rodríguez Hernández>
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */
services.service('UpdateService', ['$http', '$q', function ($http, $q) {


    var self = this;

    var currentVersion = 0;



    self.update = function(){
      return $http.get('http://192.168.1.184:8889/events/version')
        .then(function(data){

          var serverVersion = data.data.version;
          if(serverVersion>currentVersion){
            return self.getNewFilesFromServer()
              .then(function(responses){
                self.saveFiles(responses);
              }); //Update files
          }
          else{
            return $q.when(false); //Not updated -> false
          }
        });
    }



    self.getNewFilesFromServer = function(){

      var promises = [];
      for(var i = 8; i <= 15; i++){
          promises.push($http.get('http://192.168.1.184:8889/events/day/'+i));
      }

      return $q.all(promises).then(function (responses) {

        return responses;

      });

    };

    self.saveFiles = function(responses){



    }







}]);
