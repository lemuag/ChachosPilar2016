/**
 * Configuracion del modulo principal de la app.
 */


app


    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {

            //Si es Android, se colorea la barra
            if (window.StatusBar) {
                if (ionic.Platform.isAndroid()) {
                    StatusBar.backgroundColorByHexString('#035222');
                } else {
                    StatusBar.styleLightContent();
                }
            }

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

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        //El native scrolling solo se activa en Android 4.4+
        if (ionic.Platform.isAndroid()) {
            var version = parseFloat(ionic.Platform.version());
            //version = version.substr(0,3);
            if (version >= 4.4) {
                $ionicConfigProvider.scrolling.jsScrolling(false);
            }
            else {

            }
        }
        //Descomentar para quitar animaciones de transicion entre paginas
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
                        controller: 'MainCtrl'
                    }
                }
            })
            //Pantalla principal de guía
            .state('app.guide', {
                url: "/guide",
                views: {
                    'menuContent': {
                        templateUrl: "templates/guide.html",
                        controller: 'GuideCtrl'
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
            //Pantalla de resultado de busqueda
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
                        controller: 'FavListCtrl'
                    }
                }
            })

            //Pantalla de telefonos
            .state('app.phones', {
                url: "/phones",
                views: {
                    'menuContent': {
                        templateUrl: "templates/phones.html",
                        controller: 'PhonesCtrl'
                    }
                }
            })

            //Pantalla de informacion sobre las fiestas
            .state('app.info', {
                url: "/info",
                views: {
                    'menuContent': {
                        templateUrl: "templates/info.html",
                        controller: 'InfoCtrl'
                    }
                }
            })

            //Pantalla de informacion sobre la aplicacion
            .state('app.about', {
                url: "/about",
                views: {
                    'menuContent': {
                        templateUrl: "templates/about.html",
                        controller: 'AboutCtrl'
                    }
                }
            });




        //Estado por defecto -> pantalla principal
        $urlRouterProvider.otherwise('/app/main');

    });
