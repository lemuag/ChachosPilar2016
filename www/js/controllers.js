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

.controller('EventListCtrl',function($scope,$stateParams,$state,EventService){
  
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


})

.controller('EventDetailCtrl',function($scope,$stateParams,$compile,EventService){

  //Controlador de pantalla de detalle de evento
 
  
   
  //Llamada tras obtener datos de evento
  this.afterLoad = function(data){
    $scope.event = data;
  
  }


  $scope.participantNumber = 25;
  $scope.eventId = $stateParams.eventId;
  $scope.texto = "Asistir";
  $scope.favorite = false;
  $scope.textoFavorito = "Marcar como favorito";

  EventService.get($scope.eventId,this.afterLoad);

  $scope.addParticipant = function(){
    $scope.participantNumber++;
    $scope.texto = "Dejar de asistir";
  }

  $scope.removeParticipant = function(){
    $scope.participantNumber--;
    
  }

  $scope.favoriteEvent = function(){
    if(!$scope.favorite){
      $scope.textoFavorito = "Quitar de favoritos"
    }
    else{
      $scope.textoFavorito = "Marcar como favorito"
    }
    $scope.favorite = !$scope.favorite;
  }


 
});