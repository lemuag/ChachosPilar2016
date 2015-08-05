
/**
 * Controlador de la lista de favoritos.
 */
controllers.controller('FavListCtrl', ["$scope","$stateParams","$state","EventService","FavoriteService","$ionicLoading",
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

    }]);