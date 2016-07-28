
/**
* Servicio para la gestión de la carga de eventos y listas de eventos.
*
* Copyright (C) <2016> <Ismael Rodríguez Hernández>
* All rights reserved.
*
* This software may be modified and distributed under the terms
* of the BSD license.  See the LICENSE file for details.
*/
services.service('EventService', ['$http', '$q','$cordovaFile','$localstorage', function ($http, $q,$cordovaFile,$localstorage) {


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



  this.reloadData = function(){
    is_data_loaded = false;
    this.loadEvents();
  }

  /**
  * Carga eventos, bien de caché o de ficheros.
  */
  this.loadEvents = function() {

    var returnedPromise = $q.defer();

    if(is_data_loaded){
      return $q.when(data);

    }
    else{


      var promises = [];
      for(var i = 8; i <=15;i++){

          promises.push($q.when(JSON.parse($localstorage.get('programa-dia' + i,"[]"))));

      }


      return $q.all(promises).then(function (resp) {

        var i;
        for (i = 0; i < resp.length; i++) {
            data.push(resp[i]);

        }

        is_data_loaded = true;



      });
    }



  }

  //Devuelve el evento con el id indicado
  this.getOne = function(id){
    return this.loadEvents()
    .then(function(events){

      var index = 0;
      if(id<900){ //dia 8
        index = 0;
      }
      else if(id< 1000){ //dia 9
        index = 1;
      }
      else if(id < 1100){ //dia 10
        index = 2;
      }
      else if(id < 1200){ //dia 11
        index = 3;
      }
      else if(id < 1300){ //dia 12
        index = 4;
      }
      else if(id < 1400){ //dia 13
        index = 5;
      }
      else if(id < 1500){ //dia 14
        index = 6;
      }
      else{ //dia 15
        index = 7;
      }

      var dia = data[index];

      //Buscar el que tenga el id buscado
      var found = false;
      for(var i = 0; i < dia.length && !found; i++){
          if(dia[i].id == id){
            found = dia[i];
          }
      }
      return found;


    });
  }

  this.getAll = function(){
    return this.loadEvents() //Carga los eventos, o de memoria o de ficheros
    .then(function(events){

      //Se obtiene la lista pedida
      return data;
    });
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
