/**
* Controlador del listado de eventos.
*
*
* Copyright (C) <2015> <Ismael Rodríguez Hernández>
* All rights reserved.
*
* This software may be modified and distributed under the terms
* of the BSD license.  See the LICENSE file for details.
*/
controllers.controller('EventListCtrl', ["$scope","$stateParams","$state","EventService","FavoriteService","$ionicLoading","$ionicScrollDelegate","$http","$cordovaToast",
function ($scope, $stateParams, $state, EventService, FavoriteService, $ionicLoading, $ionicScrollDelegate,$http,$cordovaToast) {



  $scope.day = $stateParams.day; //Obtiene el dia
  $scope.category = $stateParams.category; //Obtiene la categoria
  $scope.listTitle = "Programa"; //Titulo de la pantalla


  var day_defined;
  var cat_defined;

  var day_parameter;
  var cat_parameter;

  day_defined = ($scope.day != undefined && $scope.day.length > 0 && $scope.day > 0); //Dia definido

  //Categoria definida
  cat_defined = ($scope.category != undefined && $scope.category.length > 0 && $scope.category != "todas");

  $scope.hayCat = cat_defined;


  //Si el dia no ha sido definido, entonces se mostrarán todos
  if (day_defined) {
    $scope.listTitle += " - Día " + $scope.day;
    day_parameter = $scope.day;
  }
  else {
    day_parameter = -1;
    $scope.day = 8; //Se empezará mostrando el 8
    if (!cat_defined) {
      $scope.listTitle += " completo"
    }

  }

  //Si la categoría no ha sido definida, se mostrarán todas
  if (cat_defined) {
    $scope.listTitle  = $scope.category.substr(0, 1).toUpperCase() + $scope.category.substr(1) + " - Día " + $scope.day;
    cat_parameter = $scope.category;
  }
  else {
    cat_parameter = "todas";
  }

  //Se obtienen los datos
  EventService.getList(cat_parameter, day_parameter)
  .then(function(data){
    //Muestra solo los datos del primer dia, para evitar sobrecarga cuando hay muchos eventos.


    $scope.events = data[0];
    $ionicLoading.hide();
  })


  /** Declaración de funciones **/

  //Sube la pantalla hacia arriba
  $scope.subir = function () {
    $ionicScrollDelegate.scrollTop(true);
  };


  $scope.setDay = function(day){

    $scope.day = day;

    if(cat_defined){
      $scope.listTitle  = $scope.category.substr(0, 1).toUpperCase() + $scope.category.substr(1) + " - Día " + $scope.day;
    }
    else{
      $scope.listTitle  = "Programa - Día " + $scope.day;
    }
    EventService.getList(cat_parameter, day)
    .then(function(data){
      //Se han obtenido los datos de solo un día, por eso se coge el índice 0
      $scope.events = data[0];
      $ionicScrollDelegate.resize()

    })


  }


  //Muestra un evento concreto
  $scope.displayEvent = function (id) {
    $state.go('app.eventDetail', {eventId: id})
  };

  //Devuelve true si el evento indicado es favorito
  $scope.isFav = function (id) {
    return FavoriteService.get(id);
  };



  $scope.getItemHeight = function(item, index) {
    //Make evenly indexed items be 10px taller, for the sake of example
    //console.log(item);

    //return  95 + (item.title.length + item.place_text.length)*0.5
    //console.log(window.screen.width);
    var width = window.screen.width;
    if(width>400){
      return 140;
    }
    return 120;

  };

  //Alterna el favorito de un evento
  $scope.toggleFav = function (id) {
    var current = FavoriteService.get(id);
    if (current) {
      FavoriteService.remove(id);

    }
    else {
      FavoriteService.add(id);



    }
  };


}]);
