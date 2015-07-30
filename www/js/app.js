// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

        //El native scrolling solo se activa en Android 4.1+
        if(ionic.Platform.isAndroid()){
            var version = parseFloat(ionic.Platform.version());
            //version = version.substr(0,3);
            if(version >= 4.4){
                $ionicConfigProvider.scrolling.jsScrolling(false);
                //alert("Tienes android " + version + " y se activa native scrolling");
            }
            else{
                //alert("Tienes android " + version + " y NO se activa native scrolling");
            }
        }
        //$ionicConfigProvider.views.transition('none');

  $stateProvider


  //Contiene el menú lateral.
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })


//Pantalla principal, con las distintas opciones
 .state('app.main', {
    url: "/main",
    views: {
      'menuContent': {
        templateUrl: "templates/main.html",
        controller: 'MainCtrl',
      }
    }
  })
  //Pantalla principal de guía
 .state('app.guide', {
    url: "/guide",
    views: {
      'menuContent': {
        templateUrl: "templates/guide.html",
        controller: 'GuideCtrl',
      }
    }
  })

//Listado de eventos de una categoría, un día concreto
 .state('app.eventList', {
      url: "/eventlist/:day/:category",
      views: {
        'menuContent': {
          templateUrl: "templates/eventList.html",
          controller: 'EventListCtrl'
        }
      }
    })
 .state('app.searchList', {
      url: "/searchlist/:term",
      views: {
        'menuContent': {
          templateUrl: "templates/searchList.html",
          controller: 'SearchListCtrl'
        }
      }
    })

   //Pantalla de detalle de un evento
  .state('app.eventDetail', {
    url: "/events/:eventId",
    views: {
      'menuContent': {
        templateUrl: "templates/eventDetail.html",
        controller: 'EventDetailCtrl'
      }
    }
  })

      //Pantalla de favoritos
      .state('app.favList', {
          url: "/favList",
          views: {
              'menuContent': {
                  templateUrl: "templates/favList.html",
                  controller: 'favListCtrl'
              }
          }
      })

      //Pantalla de favoritos
      .state('app.phones', {
          url: "/phones",
          views: {
              'menuContent': {
                  templateUrl: "templates/phones.html",
                  controller: 'phonesCtrl'
              }
          }
      })

      .state('app.info', {
          url: "/info",
          views: {
              'menuContent': {
                  templateUrl: "templates/info.html",
                  controller: 'infoCtrl'
              }
          }
      })

      .state('app.about', {
          url: "/about",
          views: {
              'menuContent': {
                  templateUrl: "templates/about.html",
                  controller: 'aboutCtrl'
              }
          }
      })

      .state('app.test', {
          url: "/test",
          views: {
              'menuContent': {
                  templateUrl: "templates/test.html",
                  controller: 'testCtrl'
              }
          }
      })

  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/main');
});
