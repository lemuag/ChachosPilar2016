/**
 * Controlador de la pagina principal de presentacion.
 */
controllers.controller('MainCtrl', ["$scope","$stateParams","$state",function ($scope, $stateParams, $state) {


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

}]);