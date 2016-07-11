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
controllers.controller('EventListCtrl', ["$scope","$stateParams","$state","EventService","FavoriteService","$ionicLoading","$ionicScrollDelegate","$http",
    function ($scope, $stateParams, $state, EventService, FavoriteService, $ionicLoading, $ionicScrollDelegate,$http) {



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

        //Se obtienen los datos
        EventService.getList(cat_parameter, day_parameter)
        .then(function(data){
          //Muestra solo los datos del primer dia, para evitar sobrecarga cuando hay muchos eventos.
          $scope.allEvents = data;
          $scope.current_day = 0;
          $scope.events = data[0];
          $ionicLoading.hide();
        })


        /** Declaración de funciones **/

            //Sube la pantalla hacia arriba
        $scope.subir = function () {
            $ionicScrollDelegate.scrollTop(true);
        };

        //Carga datos del siguiente dia
        $scope.nextDay = function () {
            $scope.current_day++;
            $scope.events = $scope.allEvents[$scope.current_day];
            $ionicScrollDelegate.resize()

        };

        //Carga datos del dia anterior
        $scope.previousDay = function () {
            $scope.current_day--;
            $scope.events = $scope.allEvents[$scope.current_day];
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

            //return (index % 2) === 0 ? 50 : 60;
          };

        //Alterna el favorito de un evento
        $scope.toggleFav = function (id) {
            var current = FavoriteService.get(id);
            if (current) {
                FavoriteService.remove(id);
                //$ionicLoading.show({template: 'Borrado de favoritos', noBackdrop: true, duration: 700});
                  //$http.get('http://192.168.1.37:4567/unfav/' + id);
            }
            else {
                FavoriteService.add(id);
                $ionicLoading.show({template: 'Añadido a favoritos', noBackdrop: true, duration: 700});
                //$http.get('http://192.168.1.37:4567/dofav/' + id);
            }
        };


    }]);
