angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/dias.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  
})



.controller('MainCtrl',["$scope","$stateParams","$state","$http","EventService",
  function($scope,$stateParams,$state,$http,EventService){
//Controlador de pantalla Main, que es la de inicio.


/** Va a la pantalla de listado de eventos, mostrando los eventos del día concreto especificado.
  Puede indicarse -1 para todos los días, o un día de 8 a 15 */
$scope.openDay = function(d){
  $state.go('app.eventList',{day:d}); 
};



$scope.openCategory = function(c){
  $state.go('app.eventList',{category:c});
}

  

 
}])

.controller('EventListCtrl',function($scope,$stateParams,$state,EventService,FavoriteService,$ionicLoading){
  
//Controlador de pantalla de listado de eventos
//TO-DO: Load real data

$scope.day = $stateParams.day;
$scope.category = $stateParams.category;
$scope.listTitle = "Programa"
console.log($scope.day);

  var day_defined
  var cat_defined;
  var day_parameter;
  var cat_parameter;
  //Funcion de callback llamada cuando los datos se han cargado
  this.afterLoad = function(data){
   $scope.events = data;

  }

  //Se cargan 

  

  day_defined = ($scope.day != undefined && $scope.day.length > 0 && $scope.day > 0);
  cat_defined = ($scope.category != undefined && $scope.category.length > 0 && $scope.category != "todas");


  //Si el dia no ha sido definido, entonces se mostrarán todos
  if(day_defined){
    $scope.listTitle += " - Día " + $scope.day;
    day_parameter = $scope.day;
  }
  else{
    day_parameter = -1;
    if(!cat_defined){
      $scope.listTitle += " completo"
    }

  }


  //Si la categoría no ha sido definida, se mostrarán todas
  if(cat_defined){
    $scope.listTitle += " - " + $scope.category;
    cat_parameter = $scope.category;
  }
  else{
    cat_parameter = "todas";
  }



  //Se obtienen los datos
  EventService.getList(cat_parameter,day_parameter,this.afterLoad);


  
   
   //Muestra un evento concreto
   $scope.displayEvent = function(id){
      $state.go('app.eventDetail', {eventId:id})
   };

   $scope.cuenta = 0;


      $scope.isFav = function(id){
        return FavoriteService.get(id);
      }

      $scope.toggleFav = function(id){
        var current = FavoriteService.get(id);
        if(current){
          FavoriteService.remove(id);
          $ionicLoading.show({ template: 'Borrado de favoritos', noBackdrop: true, duration: 1000 });
        }
        else{
          FavoriteService.add(id);
          $ionicLoading.show({ template: 'Añadido a favoritos', noBackdrop: true, duration: 1000 });
        }
      }

})

    .controller('favListCtrl',function($scope,$stateParams,$state,EventService,FavoriteService,$ionicLoading){

//Controlador de pantalla de listado de eventos
//TO-DO: Load real data


      $scope.listTitle = "Favoritos"
      console.log($scope.day);


      //Funcion de callback llamada cuando los datos se han cargado
      this.afterLoad = function(data){
       $scope.events = data;
       /* var i;
        var j;
        for(i = 0; i < data.length; i++){
          $scope.events[i] = new Array;
          for (j = 0; j < data[i].length; j++){
            if(FavoriteService.get(data[i][j].id)){
              $scope.events[i].push(data[i][j]);
            }
          }
        }*/

      }



      //Se obtienen los datos
      EventService.getList("todas",-1,this.afterLoad);



      //Muestra un evento concreto
      $scope.displayEvent = function(id){
        $state.go('app.eventDetail', {eventId:id})
      };

      $scope.cuenta = 0;

      //Recibe un array de eventos de un dia
      //Devuelve true si tiene un favorito
      $scope.dayHasFav = function(day){
        var has = false;
        var i = 0;
        for(i = 0; i < day.length; i++){
          if (FavoriteService.get(day[i].id)){
            has = true;
          }
        }
        return has;
      }




      $scope.isFav = function(id){
        return FavoriteService.get(id);
      }

      $scope.toggleFav = function(id){
        var current = FavoriteService.get(id);
        if(current){
          FavoriteService.remove(id);
          $ionicLoading.show({ template: 'Borrado de favoritos', noBackdrop: true, duration: 1000 });
        }
        else{
          FavoriteService.add(id);
          $ionicLoading.show({ template: 'Añadido a favoritos', noBackdrop: true, duration: 1000 });
        }
      }

    })

    .controller('EventDetailCtrl',function($scope,$stateParams,$compile,EventService,FavoriteService,$ionicLoading){

  //Controlador de pantalla de detalle de evento
  $scope.eventId = parseInt($stateParams.eventId);

  //Se obtiene si es favorito
  $scope.favorite = FavoriteService.get($scope.eventId);

      if($scope.favorite){
        console.log("Favorito true: " + $scope.favorite);
        $scope.textoFavorito = "Favorito";
      }
      else{
        console.log("Favorito false: " + $scope.favorite);
        $scope.textoFavorito = "No favorito";
      }



   
  //Llamada tras obtener datos de evento
  this.afterLoad = function(data){
    $scope.event = data;
  
  }



      $scope.launchMap = function(){
        window.open("geo:" + $scope.event.place_long +"," + $scope.event.place_lat, "_system");
      }

  EventService.get($scope.eventId,this.afterLoad);

      $scope.isFav = function(){
        return FavoriteService.get($scope.eventId);
      }

  $scope.favoriteEvent = function(){

    if(!$scope.favorite){
      //Se pone como favorito
      FavoriteService.add($scope.eventId);
      $scope.textoFavorito = "Favorito"
      $ionicLoading.show({ template: 'Añadido a favoritos', noBackdrop: true, duration: 1000 });
    }
    else{
      //Se quita de favoritos
      FavoriteService.remove($scope.eventId);
      $scope.textoFavorito = "No favorito"
      $ionicLoading.show({ template: 'Borrado de favoritos', noBackdrop: true, duration: 1000 });
    }
    $scope.favorite = !$scope.favorite;
  }


 
});