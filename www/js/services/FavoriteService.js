/**
 * Servicio para la gestion de los eventos favoritos.
 *
 *
 * Copyright (C) <2016> <Ismael Rodríguez Hernández>
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */
services.service('FavoriteService', ['$localstorage','$http','$cordovaToast','$ionicLoading', function ($localstorage,$http,$cordovaToast,$ionicLoading) {

    /**
     * La lista de favoritos se implementa en base a $localstorage. Hay un par clave-valor
     * con clave 'favList', que es un array numérico cuyo valor es un número de evento.
     *
     */

    var self = this;
    var list = $localstorage.getObject('favList').list;

    //Añade como favorito un evento
    this.add = function (id) {

        //Se envia peticion HTTP (despreocuparse de resultado)
        $http.put('http://sanlorenzo.ismaelrh.com:8889/events/fav/' + id);



        list.push(id); //Se añade a lista en memoria y se guarda
        $localstorage.setObject('favList', {
            list: list
        });

        if (ionic.Platform.isAndroid()) {
          $cordovaToast.showShortBottom('Añadido a favoritos');
        }
        else{
          $ionicLoading.show({template: 'Añadido a favoritos', noBackdrop: true, duration: 700});
        }

    };

    //Elimina el favorito de un evento
    this.remove = function (id) {


        //Se envia peticion HTTP (despreocuparse de resultado)
        $http.delete('http://sanlorenzo.ismaelrh.com:8889/events/fav/' + id);


        var indice = list.indexOf(id);
        if (indice > -1) {
            list.splice(indice, 1);
            $localstorage.setObject('favList', {
                list: list
            });
        }

        if (ionic.Platform.isAndroid()) {
          $cordovaToast.showShortBottom('Eliminado de favoritos');
        }
        else{
          $ionicLoading.show({template: 'Eliminado de favoritos', noBackdrop: true, duration: 700});
        }

    };


    //Devuelve si es favorito o no un cierto evento
    this.get = function (id) {

        return (list.indexOf(id)!=-1);

    };

    //Devuelve un array con los ids de los favoritos
    this.getList = function () {

        return list;
    }

}]);
