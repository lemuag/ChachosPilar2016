/**
 * Controlador de la lista de resultados de búsqueda.
 *
 *
 * Copyright (C) <2015> <Ismael Rodríguez Hernández>
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */
controllers.controller('SearchListCtrl', ["$scope","$stateParams","$state","EventService","FavoriteService","$ionicLoading",
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



        //Se obtienen los datos
        EventService.getAll().then(function(data){
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
        });


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


        $scope.all = function(){

          var array = [];
          for(var i = 0; i < $scope.events.length; i++){
            var day = $scope.events[i];
            for(var j = 0; j < day.length;j++){
              array.push(day[j]);
            }
          }
          return array;
        }
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


    }]);
