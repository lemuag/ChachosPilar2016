angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$state) {
  

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/dias.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

        $scope.goMain = function(){
            $state.go('app.main');
        };

        $scope.goGuide = function(){
            $state.go('app.guide');
        };

        $scope.goFavList = function(){
            $state.go('app.favList');
        };

        $scope.goPhones = function(){
            $state.go('app.phones');
        };

        $scope.goInfo = function(){
            $state.go('app.info');
        };

        $scope.goAbout = function(){
            $state.go('app.about');
        };

  
})



.controller('GuideCtrl',["$scope","$stateParams","$state","$http","EventService",
  function($scope,$stateParams,$state,$http,EventService,$ionicLoading){
//Controlador de pantalla Main, que es la de inicio.

$scope.filtro = "";
$scope.buscarVisible = false;
/** Va a la pantalla de listado de eventos, mostrando los eventos del día concreto especificado.
  Puede indicarse -1 para todos los días, o un día de 8 a 15 */
$scope.openDay = function(d){

  $state.go('app.eventList',{day:d}); 
};



$scope.openCategory = function(c){

  $state.go('app.eventList',{category:c});
}

  
$scope.buscar = function(){

   $state.go('app.searchList', {term:$scope.filtro});
   $scope.buscarVisible = false;
    $scope.filtro = "";
}

$scope.toggleSearch = function(){
$scope.buscarVisible = !$scope.buscarVisible;

}
 
}])

.controller('EventListCtrl',function($scope,$stateParams,$state,EventService,FavoriteService,$ionicLoading,$ionicScrollDelegate){
  
//Controlador de pantalla de listado de eventos
//TO-DO: Load real data

$scope.day = $stateParams.day;
$scope.category = $stateParams.category;
$scope.listTitle = "Programa";
$scope.textoBusqueda = "";



 $scope.current_day;
  var day_defined
  var cat_defined;

  var day_parameter;
  var cat_parameter;
  //Funcion de callback llamada cuando los datos se han cargado
  this.afterLoad = function(data){
   $scope.allEvents = data;
      $scope.current_day = 0;
    $scope.events = [data[0]];
      $ionicLoading.hide();

  }

  //Se cargan
        $scope.subir = function(){
            $ionicScrollDelegate.scrollTop(true);
        }

        $scope.nextDay = function(){
            $scope.current_day++;
            $scope.events = [$scope.allEvents[$scope.current_day]];
            $ionicScrollDelegate.resize()

        }

        $scope.previousDay = function(){
            $scope.current_day--;
            $scope.events = [$scope.allEvents[$scope.current_day]];
            $ionicScrollDelegate.resize()
        }

  day_defined = ($scope.day != undefined && $scope.day.length > 0 && $scope.day > 0);

  cat_defined = ($scope.category != undefined && $scope.category.length > 0 && $scope.category != "todas");
        $scope.hayCat =cat_defined;


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

   //Encargado del filtrado en tiempo real
   $scope.search = function(){



      var temp = [[],[],[],[],[],[],[],[]];
      var term = $scope.textoBusqueda;

      term = standarize(term);

      var n = 0;
      var i = 0;
       var loaded = 0;
       var limit = 2;
      for(i = 0; i < $scope.allEvents.length; i++){
        var j = 0;
        for(j=0;j < $scope.allEvents[i].length;j++){
          n++;

            var name = $scope.allEvents[i][j].title;
            var place = $scope.allEvents[i][j].place_text;
            name = standarize(name);
            place = standarize(place);
            if((name.indexOf(term)>-1 || place.indexOf(term)> -1)){
             
              temp[i].push($scope.allEvents[i][j]);
                loaded++;
            }

        }
      }
      $scope.events = temp;


      
   }

   //Pasa a minusculas y quita caracteres especiales
   var standarize = function(string){
      var t = string;
      t = t.toLowerCase();
      t = t.replace(/á/g,"a");
      t = t.replace(/é/g,"e");
      t = t.replace(/í/g,"i");
      t = t.replace(/ó/g,"o");
      t = t.replace(/ú/g,"u");
      t = t.replace(/à/g,"a");
      t = t.replace(/è/g,"e");
      t = t.replace(/ì/g,"i");
      t = t.replace(/ò/g,"o");
      t = t.replace(/ù/g,"u");
      t = t.replace(/ñ/g,"n");
      t = t.replace(/ü/g,"u");
      t = t.replace(/ç/g,"c");
      return t;

   }

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


      $scope.hayFavoritos = function(day){
        var has = false;
        var i, j;
        for(i = 0; $scope.events!= undefined && i < $scope.events.length; i++){

          for(j=0; $scope.events[i] != undefined && j < $scope.events[i].length;j++){
            if(FavoriteService.get($scope.events[i][j].id)){
              has = true;
            }
          }

        }
        return has;
      }

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


    .controller('SearchListCtrl',function($scope,$stateParams,$state,EventService,FavoriteService,$ionicLoading) {

//Pasa a minusculas y quita caracteres especiales
     var standarize = function(string){
        var t = string;
        t = t.toLowerCase();
        t = t.replace(/á/g,"a");
        t = t.replace(/é/g,"e");
        t = t.replace(/í/g,"i");
        t = t.replace(/ó/g,"o");
        t = t.replace(/ú/g,"u");
        t = t.replace(/à/g,"a");
        t = t.replace(/è/g,"e");
        t = t.replace(/ì/g,"i");
        t = t.replace(/ò/g,"o");
        t = t.replace(/ù/g,"u");
        t = t.replace(/ñ/g,"n");
        t = t.replace(/ü/g,"u");
        t = t.replace(/ç/g,"c");
        return t;

   }
  
      var hayResultados = false;
      $scope.term = $stateParams.term;
      $scope.termArray = $scope.term.split(" ");
      $scope.numberOfResults = 0;
      //Estandarizamos el array
      var j = 0;
      for(j = 0; j < $scope.termArray.length; j++){
        $scope.termArray[j] = standarize($scope.termArray[j]);
      }

      //Funcion de callback llamada cuando los datos se han cargado
      this.afterLoad = function(data){
       $scope.events = new Array;
          $ionicLoading.hide();
       //Realiza el filtrado
       var day = 0;
       for(day = 0; day < data.length; day++){
        var ev = 0;
        $scope.events.push([]);
        for(ev = 0; ev < data[day].length; ev++){
            //Aqui se mira cada evento

            var has = 0;
            var i = 0;
            while( i < $scope.termArray.length){
              var title = standarize(data[day][ev].title);
              var place = standarize(data[day][ev].place_text);
              if(title.indexOf($scope.termArray[i])> -1 || place.indexOf($scope.termArray[i]) > -1)
                {
                has++;
              }
              i++
            }
            if(has==$scope.termArray.length){
              $scope.events[day].push(data[day][ev]);
              hayResultados = true;
              $scope.numberOfResults++;
            }
        }
       }

      }
    
      
      //Se obtienen los datos
      EventService.getList("todas",-1,this.afterLoad);

      $scope.hayResultados = function(){
          return hayResultados;
      }

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
    .controller('EventDetailCtrl',function($scope,$stateParams,$compile,EventService,FavoriteService,$ionicLoading){

  //Controlador de pantalla de detalle de evento
  $scope.eventId = parseInt($stateParams.eventId);

  //Se obtiene si es favorito
  $scope.favorite = FavoriteService.get($scope.eventId);

      if($scope.favorite){

        $scope.textoFavorito = "Favorito";
      }
      else{

        $scope.textoFavorito = "No favorito";
      }



   
  //Llamada tras obtener datos de evento
  this.afterLoad = function(data){
    $scope.event = data;
  
  }



      $scope.launchMap = function(){
        //https://www.google.com/maps/preview/@-15.623037,18.388672,8z
        window.open("http://maps.google.com/maps?q=loc:" + $scope.event.place_lat +"," + $scope.event.place_long , "_system");
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


 
})


    .controller('phonesCtrl',function($scope){

        $scope.hola = [];
        for(var i = 0; i < 100; i++){
            $scope.hola.push("a" + i);
        }
      var emergencias = {
            "name": "Emergencias",
            "phones": [

              {
                "title": "Guardia Civil",
                "phone": "062"
              },
              {
                "title": "Policía Nacional",
                "phone": "091"
              },
              {
                "title": "Policía Local",
                "phone": "092"
              },
              {
                "title": "Protección Civil",
                "phone": "974 221 540"
              },
              {
                "title": "Bomberos",
                "phone": "974 220 000"
              },
              {
                "title": "Cruz Roja",
                "phone": "974 221 186"
              },
            ]
          };


      var hospitales = {
        "name": "Hospitales y ambulatorios",
        "phones": [

          {
            "title": "Hospital General San Jorge",
            "phone": "974 247 000"
          },
          {
            "title": "Hospital Sagrado Corazón de Jesús",
            "phone": "974 292 000"
          },
          {
            "title": "Clínica Santiago",
            "phone": "974 220 600"
          },
          {
            "title": "Centro de salud Pirineos",
            "phone": "974 221 922"
          },
           {
            "title": "Centro de salud Santo Grial",
            "phone": "974 244 122"
          },
          {
            "title": "Centro de salud Perpetuo Socorro",
            "phone": "974 225 450"
          },
          {
            "title": "Centro de salud Huesca Rural",
            "phone": "974 228 672"
          }
        ]
      };

      var transportes = {
        "name": "Transportes",
        "phones": [

          {
            "title": "RENFE",
            "phone": "902 24 05 05"
          },
          {
            "title": "Estación de autobuses",
            "phone": "974 210 700"
          },
          {
            "title": "Taxis",
            "phone": "974 595 959"
          }
        ]


      };

      var informacion = {
        "name": "Información",
        "phones": [

          {
            "title": "Ayuntamiento de Huesca",
            "phone": "974 292 100"
          },
          {
            "title": "Turismo",
            "phone": "974 292 170"
          },
          {
            "title": "Fiestas (ayuntamiento)",
            "phone": "974 292 130"
          }
        ]
      }


      $scope.phones = [emergencias,informacion,transportes,hospitales];

      $scope.call = function(phone){

        
        window.open("tel: " + phone, "_system");
      

      }


    })

.controller('MainCtrl',function($scope,$stateParams,$state,EventService,FavoriteService,$ionicLoading){



  $scope.openGuide = function(){
    $state.go('app.guide');
  };
  $scope.openFavorites = function(){
    $state.go('app.favList');
  };
  $scope.openPhones = function(){
    $state.go('app.phones');
  };
 $scope.openInfo = function(){
    $state.go('app.info');
  };

})

.controller('infoCtrl',function($scope,$stateParams,$state,EventService,FavoriteService,$ionicLoading){


var groups = [false,false,false,false,false];

 $scope.toggleGroup = function(id){


  var i;
  for(i=0;i<groups.length;i++){
    if(i!=id){
       groups[i] = false;
    }
    else{
      groups[id] = !groups[id];
    }
  }

 };

 $scope.isGroupShown = function(id){

  return groups[id];
 }

})

.controller('aboutCtrl',function($scope,$stateParams,$state){

    $scope.mail = function(phone){
          
      window.open("mailto:ismaro.394@gmail.com", "_system");
    }
    $scope.twitter = function(phone){
          
      window.open("https://twitter.com/ismaro3", "_system");
    }
    $scope.github= function(phone){
          
      window.open("https://github.com/ismaro3/sanLorenzo-ionic", "_system");
    }


})


    .controller('testCtrl',function($scope,$stateParams,$state){



    })
;