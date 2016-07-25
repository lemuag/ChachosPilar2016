/**
 * Controlador del menú lateral o drawer
 *
 *
 * Copyright (C) <2015> <Ismael Rodríguez Hernández>
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */
controllers.controller('AppCtrl', ['$scope','$ionicModal','$timeout','$state',
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


    }]);
