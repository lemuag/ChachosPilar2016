
/**
 * Controlador de la lista de favoritos.
 *
 * Copyright (C) <2015> <Ismael Rodríguez Hernández>
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */
controllers.controller('FavListCtrl', ["$scope","$stateParams","$state","EventService","FavoriteService","$ionicLoading","$q",
    function ($scope, $stateParams, $state, EventService, FavoriteService, $ionicLoading,$q) {




        //Se obtienen los datos


        var favList = FavoriteService.getList();
        var promises = [];
        for(var i = 0; i < favList.length; i++){
          promises.push(EventService.getOne(favList[i]));
        }

        $q.all(promises)
          .then(function(results){
            $scope.events = [[],[],[],[],[],[],[],[]];
            for(var j = 0; j< results.length;j++){
              var index = results[j].day - 8;
              $scope.events[index].push(results[j]);
            }
          });



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
            }
            else {
                FavoriteService.add(id);
                $ionicLoading.show({template: 'Añadido a favoritos', noBackdrop: true, duration: 1000});
            }
        };

    }]);
