
/**
 * Servicio para la gestión de la carga de eventos y listas de eventos.
 *
 * Copyright (C) <2016> <Ismael Rodríguez Hernández>
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */
services.service('EventService', ['$http', '$q', function ($http, $q) {


    var self = this;

    var start_day = 8; //Dia de inicio de las fiestas
    var finish_day = 15; //Dia de fin de las fiestas

    var is_data_loaded = false; //indica si los datos están en memoria

    //Constant values
    var DAYS_ALL = -1;
    //Categorías disponibles: "todas","conciertos","toros","infantil","otros"
    var CAT_ALL = "todas";


    //Datos cargados. Array asociativo para cada día.
    var data = new Array();


    //Usados para el intercambio de datos con la función "loadData"
    var current_category;
    var current_day;
    var current_id;


    /*** FUNCIONES PRIVADAS ***/
    //Se encarga de, una vez cargados los datos, obtener la lista pedida
    this.extractList = function (category, day) {


        var previous_data = new Array();
        //Filtramos datos por dia
        if (day != -1) {
            //Partimos de los datos de solo un día
            previous_data.push(data[day - start_day]);
        }
        else {
            //Partimos de los datos de todos los dias
            previous_data = data;

        }

        //Filtramos datos por categoria
        if (category != CAT_ALL) {
            var i;
            var j;
            var final_data = new Array();

            //Recorremos cada día
            for (i = 0; i < previous_data.length; i++) {
                var day_data = new Array();
                for (j = 0; j < previous_data[i].length; j++) {
                    var current = previous_data[i][j];
                    if (current.category == category) {
                        //Si es de la categoría, pusheamos
                        day_data.push(current);
                    }
                }
                final_data.push(day_data);

            }
            //Se devuelven los de la categoria indicada
            return final_data;
        }
        else {
            //No hay categoría, no se filtra nada.
            return previous_data;
        }
        return data;

    };

    //Se encarga de, una vez cargados los datos, obtener el evento especifico indicado
    this.find = function (id) {

        var i = 0;
        var j = 0;
        var found = false;
        var result = undefined;
        while (i < data.length && !found) {
            j = 0;
            while (j < data[i].length && !found) {
                found = (data[i][j].id == id);
                if (found) {
                    result = data[i][j];
                }
                j++;

            }
            i++;

        }
        return result;

    };



    /**
     * Carga eventos, bien de caché o de ficheros.
    */
    this.loadEvents = function() {

      var returnedPromise = $q.defer();



      if(is_data_loaded){
        returnedPromise.resolve(data);

      }
      else{
        var promises = [
            $http.get('appdata/8.json'),
            $http.get('appdata/9.json'),
            $http.get('appdata/10.json'),
            $http.get('appdata/11.json'),
            $http.get('appdata/12.json'),
            $http.get('appdata/13.json'),
            $http.get('appdata/14.json'),
            $http.get('appdata/15.json')
        ];

        $q.all(promises).then(function (resp) {


            var i;
            for (i = 0; i < resp.length; i++) {
                data.push(resp[i].data);
            }

            is_data_loaded = true;

            returnedPromise.resolve(data);

        });
      }


      return returnedPromise.promise;

    }

    /**FUNCIONES OFRECIDAS AL USUARIO */

    /* Devuelve la lista de eventos para categoria y dia indicados */
    this.getList = function (category, day) {
        return this.loadEvents() //Carga los eventos, o de memoria o de ficheros
          .then(function(events){

              //Se obtiene la lista pedida
              return self.extractList(category,day);
          });

    };

    //Se encarga de la carga de solo un evento
    this.get = function (id) {

        return this.loadEvents()
          .then(function(events){
            return event = self.find(id);

          });

    };


    /** Getters for constants */

    this.CAT_ALL = function () {
        return CAT_ALL;
    };

    this.DAYS_ALL = function () {
        return DAYS_ALL;
    };


}]);
