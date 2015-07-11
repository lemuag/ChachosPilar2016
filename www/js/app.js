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

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  //Contiene el menú lateral.
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  //Pantalla principal, con los días, categorías, etc.
 .state('app.main', {
    url: "/main",
    views: {
      'menuContent': {
        templateUrl: "templates/main.html",
        controller: 'MainCtrl',
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


   //Pantalla de detalle de un evento
  .state('app.eventDetail', {
    url: "/events/:eventId",
    views: {
      'menuContent': {
        templateUrl: "templates/eventDetail.html",
        controller: 'EventDetailCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/main');
});
