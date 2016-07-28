/**
 * Controlador de la pagina principal de presentacion.
 *
 *
 * Copyright (C) <2015> <Ismael Rodríguez Hernández>
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */
controllers.controller('MainCtrl', ["$scope","$stateParams","$state","UpdateService","$ionicPlatform","$cordovaFile",function ($scope, $stateParams, $state,UpdateService,$ionicPlatform,$cordovaFile) {


    $scope.buscarVisible = false;

    $ionicPlatform.ready(function() {


    

        UpdateService.initializeData()
          .then(function(){
            UpdateService.update();
          })



    });





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

}]);
