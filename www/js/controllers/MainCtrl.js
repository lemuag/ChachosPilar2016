/**
 * Controlador de la pagina principal de presentacion.
 *
 *
 * Copyright (C) <2015> <Ismael Rodríguez Hernández>
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */
controllers.controller('MainCtrl', ["$scope","$stateParams","$state","UpdateService","$ionicPlatform","$cordovaFile","EventService",
function ($scope, $stateParams, $state,UpdateService,$ionicPlatform,$cordovaFile,EventService) {


    $scope.buscarVisible = false;

    $scope.current = [];
    $ionicPlatform.ready(function() {




        UpdateService.initializeData()
          .then(function(){
            UpdateService.update();
          })



    });



    //Cuando se han actualizado los datos, refrescamos el cartel
    $scope.$on('dataReloaded', function (event, data) {
      //Cargar el panel de recomendaciones
      $scope.getCurrentEvents()
      .then(function(data){

        $scope.current = data;
      })
    });

    //Cuando vuelve a entrar a la vista, refrescamos el cartel
    //Esto es para que se vaya actualizando conforme la hora
    $scope.$on( "$ionicView.enter", function( scopes, states ) {

            //Cargar el panel de recomendaciones
            $scope.getCurrentEvents()
            .then(function(data){

              $scope.current = data;
            })

    });




    //Alterna la visiblidad de la busqueda
    $scope.toggleSearch = function () {
        //$scope.add();
        $scope.buscarVisible = !$scope.buscarVisible;

    };

    //Busca en los eventos
    $scope.buscar = function () {

        $state.go('app.searchList', {term: $scope.filtro});
        $scope.buscarVisible = false;
        $scope.filtro = "";
    };


    //Funciones de ruta

    $scope.openGuide = function () {
        $state.go('app.guide');
    };
    $scope.openFavorites = function () {
        $state.go('app.favList');
    };
    $scope.openPhones = function () {
        $state.go('app.phones');
    };
    $scope.openInfo = function () {
        $state.go('app.info');
    };




    $scope.displayEvent = function (id) {
      $state.go('app.eventDetail', {eventId: id})
    };


    $scope.getCurrentEvents = function(){

      //Si es entre las 00 y las 7 de la mañana -> Retrieve del día anterior (los de la noche están en día anterior)
      //Si es entre las 7 y las 00 -> Retrieve de este día
      var date = new Date();


      var minute = date.getMinutes();
      var hour = date.getHours();
      var day = date.getDate();





      var promiseEventos;
      if(hour>=0 && (hour<=6)) { //Entre las 00:00 y las 6:59 -> cojo el día anterior
        promiseEventos =  EventService.getList("todas", day -1);
      }
      else{ //Cojo el propio día el resto
        promiseEventos =  EventService.getList("todas", day);
      }



      return promiseEventos.then(function(data){


        var results = [];
        //Si solo un elemento undefined (ocurre), vacío
        if(data.length==1 && data[0] == undefined){
          data = [];
        }
        else{
          data = data[0];
        }


        //Busco eventos cuya fecha de inicio sea desde hace una hora, hasta dentro de una hora
        for(var i = 0; i < data.length; i++){
          var event = data[i];
          var time = getDayHourMinute(event);
          var previousHour = hour -1;
          var nextHour = hour +1;
          if(previousHour == -1){
            previousHour = 23;
          }
          if(nextHour == 24){
            nextHour = 0;
          }


          if( //Entre hace justo una hora, y dentor de una hora
            (time.hour == previousHour && time.minute >= minute ) ||
            (time.hour == hour) ||
            (time.hour == nextHour && time.minute <= minute)
          ){
            event.startHour = "" + time.hour + ":" + time.minute;
            results.push(event);
          }
        }


        return results;

      })
    }


    //Devuelve{day:X,hour:Y,minute:Z} correcto según el evento
    var getDayHourMinute = function(event){

      var hour = getHour(event);
      var minute = getMinute(event);
      var day = event.day;
      if(hour == 24 || hour == "24"){
        hour = 0;
        day++;
      }

      return {day: day, hour:hour,minute:minute};
    }

    //privada
    var getHour = function (event) {
      var hour_text = event.hour;
      dosPuntos = hour_text.indexOf(":");
      if (dosPuntos > -1) {

        return hour_text.substr(0, dosPuntos);



      }

      return undefined;
    };


    //Devuelve el minuto dada una cadena de hora
    var getMinute = function (event) {
      var hour_text = event.hour;
      dosPuntos = hour_text.indexOf(":");
      if (dosPuntos > -1) {
        return hour_text.substr(dosPuntos + 1, 2);
      }
      return undefined;
    }







}]);
