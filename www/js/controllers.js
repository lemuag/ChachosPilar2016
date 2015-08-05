angular.module('starter.controllers', [])

    /**
     * Controlador del menú lateral o drawer
     */
    .controller('AppCtrl', ['$scope','$ionicModal','$timeout','$state',
        function ($scope, $ionicModal, $timeout, $state) {


        // Crea el modal de seleccion de adelanto
        $ionicModal.fromTemplateUrl('templates/adelantoModal.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });


        //Funciones de navegacion
        $scope.goMain = function () {
            $state.go('app.main');
        };

        $scope.goGuide = function () {
            $state.go('app.guide');
        };

        $scope.goFavList = function () {
            $state.go('app.favList');
        };

        $scope.goPhones = function () {
            $state.go('app.phones');
        };

        $scope.goInfo = function () {
            $state.go('app.info');
        };

        $scope.goAbout = function () {
            $state.go('app.about');
        };


    }])


    /**
     * Controlador de pagina principal de guia
     */
    .controller('GuideCtrl', ["$scope", "$stateParams", "$state", "$http", "EventService",
        function ($scope, $stateParams, $state, $http, EventService) {


            $scope.filtro = ""; //Filtro de busqueda
            $scope.buscarVisible = false; //Indica si la barra de busqueda es visible

            /** Va a la pantalla de listado de eventos, mostrando los eventos del día concreto especificado.
             Puede indicarse -1 para todos los días, o un día de 8 a 15 */
            $scope.openDay = function (d) {

                $state.go('app.eventList', {day: d});
            };


            /** Abre una categoria **/
            $scope.openCategory = function (c) {

                $state.go('app.eventList', {category: c});
            };


            /** Realiza una busqueda **/
            $scope.buscar = function () {

                $state.go('app.searchList', {term: $scope.filtro});
                $scope.buscarVisible = false;
                $scope.filtro = "";
            };

            /** Alterna la visibilidad del panel de busqueda **/
            $scope.toggleSearch = function () {
                //$scope.add();
                $scope.buscarVisible = !$scope.buscarVisible;

            }

        }])


    /**
     * Controlador del listado de eventos.
     */
    .controller('EventListCtrl', ["$scope","$stateParams","$state","EventService","FavoriteService","$ionicLoading","$ionicScrollDelegate",
        function ($scope, $stateParams, $state, EventService, FavoriteService, $ionicLoading, $ionicScrollDelegate) {



        $scope.day = $stateParams.day; //Obtiene el dia
        $scope.category = $stateParams.category; //Obtiene la categoria
        $scope.listTitle = "Programa"; //Titulo de la pantalla

        $scope.current_day;
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
            if (!cat_defined) {
                $scope.listTitle += " completo"
            }

        }

        //Si la categoría no ha sido definida, se mostrarán todas
        if (cat_defined) {
            $scope.listTitle += " - " + $scope.category;
            cat_parameter = $scope.category;
        }
        else {
            cat_parameter = "todas";
        }


        //Funcion de callback llamada cuando los datos se han cargado
        this.afterLoad = function (data) {

            //Muestra solo los datos del primer dia, para evitar sobrecarga cuando hay muchos eventos.
            $scope.allEvents = data;
            $scope.current_day = 0;
            $scope.events = [data[0]];
            $ionicLoading.hide();

        };

        //Se obtienen los datos
        EventService.getList(cat_parameter, day_parameter, this.afterLoad);


        /** Declaración de funciones **/

        //Sube la pantalla hacia arriba
        $scope.subir = function () {
            $ionicScrollDelegate.scrollTop(true);
        };

        //Carga datos del siguiente dia
        $scope.nextDay = function () {
            $scope.current_day++;
            $scope.events = [$scope.allEvents[$scope.current_day]];
            $ionicScrollDelegate.resize()

        };

        //Carga datos del dia anterior
        $scope.previousDay = function () {
            $scope.current_day--;
            $scope.events = [$scope.allEvents[$scope.current_day]];
            $ionicScrollDelegate.resize()
        };


        //Muestra un evento concreto
        $scope.displayEvent = function (id) {
            $state.go('app.eventDetail', {eventId: id})
        };

        //Devuelve true si el evento indicado es favorito
        $scope.isFav = function (id) {
            return FavoriteService.get(id);
        };


        //Alterna el favorito de un evento
        $scope.toggleFav = function (id) {
            var current = FavoriteService.get(id);
            if (current) {
                FavoriteService.remove(id);
                $ionicLoading.show({template: 'Borrado de favoritos', noBackdrop: true, duration: 1000});
            }
            else {
                FavoriteService.add(id);
                $ionicLoading.show({template: 'Añadido a favoritos', noBackdrop: true, duration: 1000});
            }
        };


    }])

    /**
     * Controlador de la lista de favoritos.
     */
    .controller('favListCtrl', ["$scope","$stateParams","$state","EventService","FavoriteService","$ionicLoading",
        function ($scope, $stateParams, $state, EventService, FavoriteService, $ionicLoading) {


        //Funcion de callback llamada cuando los datos se han cargado
        this.afterLoad = function (data) {
            $scope.events = data;
        };


        //Se obtienen los datos
        EventService.getList("todas", -1, this.afterLoad);


        //Devuelve cierto si hay favoritos en el dia indicado
        $scope.hayFavoritos = function (day) {
            var has = false;
            var i, j;
            for (i = 0; $scope.events != undefined && i < $scope.events.length; i++) {

                for (j = 0; $scope.events[i] != undefined && j < $scope.events[i].length; j++) {
                    if (FavoriteService.get($scope.events[i][j].id)) {
                        has = true;
                    }
                }

            }
            return has;
        };

        //Muestra un evento concreto
        $scope.displayEvent = function (id) {
            $state.go('app.eventDetail', {eventId: id})
        };


        //Recibe un array de eventos de un dia
        //Devuelve true si tiene un favorito
        $scope.dayHasFav = function (day) {
            var has = false;
            var i = 0;
            for (i = 0; i < day.length; i++) {
                if (FavoriteService.get(day[i].id)) {
                    has = true;
                }
            }
            return has;
        };


        //Devuelve ciero si el evento indicado es favorito
        $scope.isFav = function (id) {
            return FavoriteService.get(id);
        };

        //Alterna el favorito de un evento
        $scope.toggleFav = function (id) {
            var current = FavoriteService.get(id);
            if (current) {
                FavoriteService.remove(id);
                $ionicLoading.show({template: 'Borrado de favoritos', noBackdrop: true, duration: 1000});
            }
            else {
                FavoriteService.add(id);
                $ionicLoading.show({template: 'Añadido a favoritos', noBackdrop: true, duration: 1000});
            }
        };

    }])


    /**
     * Controlador de la lista de resultados de búsqueda.
     */
    .controller('SearchListCtrl', ["$scope","$stateParams","$state","EventService","FavoriteService","$ionicLoading",
        function ($scope, $stateParams, $state, EventService, FavoriteService, $ionicLoading) {



        var hayResultados = false;

        $scope.term = $stateParams.term; //Termino de busqueda
        $scope.termArray = $scope.term.split(" "); //Array de palabras buscadas
        $scope.numberOfResults = 0;


        //Pasa a minusculas y quita caracteres especiales
        var standarize = function (string) {
            var t = string;
            t = t.toLowerCase();
            t = t.replace(/á/g, "a");
            t = t.replace(/é/g, "e");
            t = t.replace(/í/g, "i");
            t = t.replace(/ó/g, "o");
            t = t.replace(/ú/g, "u");
            t = t.replace(/à/g, "a");
            t = t.replace(/è/g, "e");
            t = t.replace(/ì/g, "i");
            t = t.replace(/ò/g, "o");
            t = t.replace(/ù/g, "u");
            t = t.replace(/ñ/g, "n");
            t = t.replace(/ü/g, "u");
            t = t.replace(/ç/g, "c");
            return t;

        };

        //Estandarizamos el array
        var j = 0;
        for (j = 0; j < $scope.termArray.length; j++) {
            $scope.termArray[j] = standarize($scope.termArray[j]);
        }

        //Funcion de callback llamada cuando los datos se han cargado
        //Se encarga de filtrar y poner en $scope.events los eventos que coinciden con la busqueda
        this.afterLoad = function (data) {
            $scope.events = new Array;
            $ionicLoading.hide();
            //Realiza el filtrado
            var day = 0;
            for (day = 0; day < data.length; day++) {
                var ev = 0;
                $scope.events.push([]);
                for (ev = 0; ev < data[day].length; ev++) {
                    //Aqui se mira cada evento

                    var has = 0;
                    var i = 0;
                    while (i < $scope.termArray.length) {
                        var title = standarize(data[day][ev].title);
                        var place = standarize(data[day][ev].place_text);
                        if (title.indexOf($scope.termArray[i]) > -1 || place.indexOf($scope.termArray[i]) > -1) {
                            has++;
                        }
                        i++
                    }
                    if (has == $scope.termArray.length) {
                        $scope.events[day].push(data[day][ev]);
                        hayResultados = true;
                        $scope.numberOfResults++;
                    }
                }
            }

        };


        //Se obtienen los datos
        EventService.getList("todas", -1, this.afterLoad);

        //Devuelve true si hay resultados
        $scope.hayResultados = function () {
            return hayResultados;
        };

        //Muestra un evento concreto
        $scope.displayEvent = function (id) {
            $state.go('app.eventDetail', {eventId: id})
        };



        //Devuelve true si el evento es favorito
        $scope.isFav = function (id) {
            return FavoriteService.get(id);
        };

        //Alterna el favorito de un evento.
        $scope.toggleFav = function (id) {
            var current = FavoriteService.get(id);
            if (current) {
                FavoriteService.remove(id);
                $ionicLoading.show({template: 'Borrado de favoritos', noBackdrop: true, duration: 1000});
            }
            else {
                FavoriteService.add(id);
                $ionicLoading.show({template: 'Añadido a favoritos', noBackdrop: true, duration: 1000});
            }
        };


    }])

    /**
     * Controlador del detalle de un evento
     */
    .controller('EventDetailCtrl', ["$scope","$stateParams","$compile","EventService","FavoriteService","$ionicLoading","NotificationService","$ionicModal","$ionicPopup",
        function ($scope, $stateParams, $compile, EventService, FavoriteService, $ionicLoading, NotificationService, $ionicModal, $ionicPopup) {


        $scope.eventId = parseInt($stateParams.eventId); //Id del evento


        //Llamada tras obtener datos de evento
        this.afterLoad = function (data) {
            $scope.event = data;

        };

        //Obtenemos los datos del evento
        EventService.get($scope.eventId, this.afterLoad);

        //Se obtiene si es favorito
        $scope.favorite = FavoriteService.get($scope.eventId);

        if ($scope.favorite) {
            $scope.textoFavorito = "Favorito";
        }
        else {
            $scope.textoFavorito = "No favorito";
        }


        //Miramos si hay reminder
        $scope.hasReminder = false;

        /*
        Si estamos en Android, se comprueba si tiene reminder el evento.
        Si tiene, y además ya ha pasado, se cancela.
         */
        if (ionic.Platform.isAndroid()) {
            NotificationService.isScheduled($scope.eventId, function (has) {

                $scope.hasReminder = has;

                if (has) {
                    //Si tenia recordatorio, se mira si ya ha pasado.
                    //Si es asi, se elimina.
                    cordova.plugins.notification.local.get($scope.eventId, function (notifications) {
                        var current = new Date();
                        current = current.getTime() / 1000;

                        var programada = notifications.at;
                        var haPasadoNotificacion = (programada < current);

                        $scope.hasReminder = !haPasadoNotificacion;
                        if (haPasadoNotificacion) {
                            //Se elimina si ya ha pasado la notificacion
                            NotificationService.removeReminder($scope.eventId);
                        }
                    });
                }
            });
        }


        /** Funciones **/

        //Devuelve cierto si ya ha pasado el evento indicado
        $scope.hasPassed = function (event) {
            //Se saca la hora y el minuto
            var time = event["hour"];

            var day = event["day"];
            var hour = getHour(time);
            var minute = getMinute(time);

            //Si la hora es las 24, se suma un dia y serán las 0:00
            //Si no lo es, se queda como esta, ya que a partir de las 0:01 esta marcado
            //en los datos como siguiente dia
            if (hour == 24) {
                day++;
                hour = 0;
            }


            var alarmTime = new Date(2015, 7, day, hour, minute, 0, 0);
            var now = new Date();
            return alarmTime.getTime() <= now.getTime();

        };


        //Devuelve la hora dada una cadena de hora
        var getHour = function (hour_text) {
            dosPuntos = hour_text.indexOf(":");
            if (dosPuntos > -1) {
                return hour_text.substr(0, dosPuntos);
            }
            return undefined;
        };

        //Devuelve el minuto dada una cadena de hora
        var getMinute = function (hour_text) {
            dosPuntos = hour_text.indexOf(":");
            if (dosPuntos > -1) {
                return  hour_text.substr(dosPuntos + 1, 2);
            }
            return undefined;
        };


        /**
         * Muestra el modal para elegir el tiempo de adelanto de alarma.
         * Si el usuario cancela, devuelve undefined.
         * Si no cancela, añade el recordatorio y devuelve true.
         * Al finalizar, actualiza "hasReminder".
         */
        $scope.showDialogoAlarma = function () {
            $scope.data = {};

            $scope.choice = {choice: 0};

            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                templateUrl: 'templates/adelantoModal.html',
                title: '<b>¿Con cuánto tiempo quieres que te avise?</b>',
                scope: $scope,
                buttons: [
                    {text: 'Cancelar'},
                    {
                        text: '<b>Confirmar</b>',
                        type: 'button-positive',
                        onTap: function (e) {

                            //Programamos la alarma
                            var exit = NotificationService.addReminder($scope.eventId, $scope.choice.choice);
                            $ionicLoading.show({
                                template: "Recordatorio programado.",
                                noBackdrop: true,
                                duration: 1000
                            });
                            return true;

                        }
                    }
                ]
            });
            myPopup.then(function (res) {
                $scope.hasReminder = res;
            });
        };


        //Alterna el estado del recordatorio
        $scope.toggleReminder = function () {

            if ($scope.hasReminder) {
                //Se elimina el recordatorio
                NotificationService.removeReminder($scope.eventId);
                $ionicLoading.show({template: 'Recordatorio eliminado', noBackdrop: true, duration: 1000});
                $scope.hasReminder = false;
            }
            else {
                //Se añade un recordatorio
                $scope.showDialogoAlarma();
            }


        };

        //Lanza un mapa
        $scope.launchMap = function () {
            window.open("http://maps.google.com/maps?q=loc:" + $scope.event.place_lat + "," + $scope.event.place_long, "_system");
        };



        $scope.isFav = function () {
            return FavoriteService.get($scope.eventId);
        };

        $scope.favoriteEvent = function () {

            if (!$scope.favorite) {
                //Se pone como favorito
                FavoriteService.add($scope.eventId);
                $scope.textoFavorito = "Favorito";
                $ionicLoading.show({template: 'Añadido a favoritos', noBackdrop: true, duration: 1000});
            }
            else {
                //Se quita de favoritos
                FavoriteService.remove($scope.eventId);
                $scope.textoFavorito = "No favorito";
                $ionicLoading.show({template: 'Borrado de favoritos', noBackdrop: true, duration: 1000});
            }
            $scope.favorite = !$scope.favorite;
        };

        //Devuelve cierto si la plataforma es Android
        $scope.isAndroid = function(){
            return ionic.Platform.isAndroid();
        }


    }])


    /**
     * Controlador de la pantalla de telefonos de interes
     */
    .controller('phonesCtrl', ["$scope",function ($scope) {

        //Telefonos de emergencias
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


        //Telefonos de hospitales
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

        //Telefonos de transportes
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

        //Telefonos de informacion
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
        };


        $scope.phones = [emergencias, informacion, transportes, hospitales];

        //Abre el marcador con el numero indicado
        $scope.call = function (phone) {
            window.open("tel: " + phone, "_system");
        }


    }])

    /**
     * Controlador de la pagina principal de presentacion.
     */
    .controller('MainCtrl', ["$scope","$stateParams","$state",function ($scope, $stateParams, $state) {


        $scope.buscarVisible = false;


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

    }])

    /**
     * Controlador de pantalla de informacion sobre las fiestas.
     */
    .controller('infoCtrl', ["$scope","$ionicScrollDelegate","$timeout",function ($scope, $ionicScrollDelegate, $timeout) {


        var groups = [false, false, false, false, false];


        //Abre un link en el navegador
        $scope.openLink = function (link) {
            window.open(link, "_system");
        };

        //Abre un grupo, es decir, una información
        $scope.toggleGroup = function (id) {


            groups[id] = !groups[id];
            $timeout(function () {
                //timeout para que de tiempo a renderizarse
                //y despues se hace resize() para evitar
                //anomalias con el scroll
                $ionicScrollDelegate.resize();
            }, 300);

        };

        //Devuelve cierto si el grupo "id" se está mostrando.
        $scope.isGroupShown = function (id) {
            return groups[id];
        }

    }])

    /**
     * Controlador de la pagina de acerca de la app
     */
    .controller('aboutCtrl', ["$scope",function ($scope) {

        //Link a mail al creador
        $scope.mail = function (phone) {
            window.open("mailto:ismaro.394@gmail.com", "_system");
        };

        //Link al twitter del creador
        $scope.twitter = function (phone) {

            window.open("https://twitter.com/ismaro3", "_system");
        };

        //Link al github del creador
        $scope.github = function (phone) {

            window.open("https://github.com/ismaro3/sanLorenzo-ionic", "_system");
        };


    }])

;