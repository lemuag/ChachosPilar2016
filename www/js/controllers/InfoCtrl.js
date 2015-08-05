/**
 * Controlador de pantalla de informacion sobre las fiestas.
 */
controllers.controller('InfoCtrl', ["$scope","$ionicScrollDelegate","$timeout",function ($scope, $ionicScrollDelegate, $timeout) {


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

}]);
