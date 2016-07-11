
/**
* Servicio para la gestión de la carga de eventos y listas de eventos.
*
* Copyright (C) <2016> <Ismael Rodríguez Hernández>
* All rights reserved.
*
* This software may be modified and distributed under the terms
* of the BSD license.  See the LICENSE file for details.
*/
services.service('UpdateService', ['$http', '$q','$cordovaFile','EventService','$localstorage', function ($http, $q,$cordovaFile,EventService,$localstorage) {


  var self = this;

  var currentVersion = undefined;

  self.lastUpdated = $localstorage.get('lastUpdated',null);

  /**
  * Si es la primera vez que se ejecuta la aplicación, copia el programa local
  * incluido en el APK al storage de Android.
  */
  self.initializeData = function(){

    //Si no es Android, terminamos aquí, pues no se copia ningún fichero.
    if (!ionic.Platform.isAndroid()) {
      return $q.when(true);
    }


    var initialized = $localstorage.get('initialized', false);
    if(!initialized){
      console.log("Initializing data... copying from local storage");
      return updateFromLocalFiles()
      .then(function(response){
        $localstorage.set('initialized',true)
      });
    }
    else{
      console.log("Data already initialized");
      return $q.when(true);
    }

  }

  /**
  * Se encarga de actualizar, si es posible, los datos de la guía/programa.
  */
  self.update = function(){


    //Si no es Android, terminamos aquí, pues no se actualizan datos.
    if (!ionic.Platform.isAndroid()) {
      return $q.when(true);
    }

    //1.- Leer versión actual programa
    return readCurrentVersion()
    .then(function(version){


      currentVersion = version;

      //2.- Se obtiene versión del servidor
      return $http.get('http://sanlorenzo.ismaelrh.com:8889/events/version')

    })

    .then(function(response){



      var serverVersion = response.data.version;
      //Si la del servidor es mayor -> se actualiza
      if(serverVersion>currentVersion){
        console.log("UPDATING. Current version: " + currentVersion + ", server version: " + serverVersion);

        //3.- Se obtienen ficheros nuevos
        return getNewFilesFromServer()
        .then(function(responses){

          var promiseArray = [];
          //4.- Se guardan los ficheros
          for(var i = 0; i < responses.length;i++){
            promiseArray.push(saveJSONtoFile('programa-dia'+(i+8)+'.json',responses[i].data));
          }

          //5.- Una vez guardados todos, se actualiza la versión actual
          return $q.all(promiseArray)
          .then(function(all){
            //6.- Decirle al EventService que refresque.
            return saveCurrentVersion(serverVersion)
            .then(function(response){
              $localstorage.set('lastUpdated',Date.now());
              self.lastUpdated = Date.now();
              EventService.reloadData();
            })
          });
        }); //Update files
      }
      else{
        console.log("No need to update, same version " + serverVersion + " - " + currentVersion);
        return $q.when(false); //Not updated -> false
      }
    });
  }


  /**
  * Guarda asíncronamente un objeto como JSON en un fichero.
  */
  function saveJSONtoFile(fileName,json){
    return $cordovaFile.writeFile(cordova.file.dataDirectory,fileName,JSON.stringify(json),true);
  }

  /**
  * Lee asíncronamente la versión de los datos de programa actuales.
  * Si no hay datos, devuelve -1.
  */
  function readCurrentVersion(){
    return $cordovaFile.readAsText(cordova.file.dataDirectory, "versionPrograma.json")
    .then(function(success){
      var v = JSON.parse(success);
      return v.version;
    })
    .catch(function(error){
      return -1;
    })
  }

  /**
  * Actualiza asíncronamente la versión de los datos de programa actuales.
  */
  function saveCurrentVersion(newVersion){
    return saveJSONtoFile("versionPrograma.json",{"version":newVersion});
  }

  /**
  * Obtiene asíncronamente el programa del día 8 al 15 del servidor web.
  */
  function getNewFilesFromServer(){

    var promises = [];
    for(var i = 8; i <= 15; i++){
      promises.push($http.get('http://sanlorenzo.ismaelrh.com:8889/events/day/'+i));
    }

    return $q.all(promises).then(function (responses) {

      return responses;

    });

  };

  /**
  * Se encarga de actualizar falsamente desde los datos provistos por el APK. Usado una primera vez
  * por si el usuario no tiene internet para actualizar, o el servidor está apagado (se apagará al acabar las fiestas)
  */
  function updateFromLocalFiles(){


    console.log("Actualizando desde ficheros locales...");
    //Se obtienen todos los ficheros, y cada uno de ellos se va guardando en el storage de Android
    var promises = [
      $http.get("appdata/8.json"),
      $http.get("appdata/9.json"),
      $http.get("appdata/10.json"),
      $http.get("appdata/11.json"),
      $http.get("appdata/12.json"),
      $http.get("appdata/13.json"),
      $http.get("appdata/14.json"),
      $http.get("appdata/15.json"),

    ];

    return $q.all(promises)
    .then(function(responses){

      var savePromises = [];
      //Se guarda cada uno de los archivos obtenidos
      for(var i = 0; i < responses.length; i++){
        savePromises.push(saveJSONtoFile('programa-dia'+(i+8)+'.json',responses[i].data));
      }

      return $q.all(savePromises);

    })


  }



















}]);
