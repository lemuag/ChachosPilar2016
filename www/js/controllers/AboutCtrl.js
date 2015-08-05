/**
 * Controlador de la pagina de acerca de la app
 */
controllers.controller('AboutCtrl', ["$scope",function ($scope) {

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


}]);