
var module = angular.module('starter.services', []);


//Usado para guardar en localStorage
module.factory('$localstorage', ['$window', function($window) {
	return {
		set: function(key, value) {
			$window.localStorage[key] = value;
		},
		get: function(key, defaultValue) {
			return $window.localStorage[key] || defaultValue;
		},
		setObject: function(key, value) {
			$window.localStorage[key] = JSON.stringify(value);
		},
		getObject: function(key) {
			return JSON.parse($window.localStorage[key] || JSON.stringify({list: new Array}));
		}
	}
}])

//Usado para control de favoritos
module.service('FavoriteService',['$localstorage', function($localstorage){

    /**
     * La lista de favoritos se implementa en base a $localstorage.
     * Hay un clave-valor para cada evento, que está puesto a 1 si está como favorito, 0 si no.
     * La clave es de forma 'fav'[id]
     * Además, para obtener rápidamente una lista de los favoritos, hay un par clave-valor
     * con clave 'favList', que es un array numérico cuyo valor es un número de evento.
     *
     */

	var self = this;

    //Añade como favorito
    this.add = function(id){
        //Se añade al almacen clave-valor
        $localstorage.set('fav'+id,1);

        //Se añade a la lista
        var list = $localstorage.getObject('favList').list;
        list.push(id);
        $localstorage.setObject('favList',{
            list: list
        });

    }

    //Elimina el favorito
    this.remove = function(id){
        //Se elimina del almacén clave-valor
        $localstorage.set('fav'+id,0);

        //Se quita de la lista
        var list = $localstorage.getObject('favList').list;

        var indice = list.indexOf(id);
        if(indice> -1){
            list.splice(indice,1);
            $localstorage.setObject('favList',{
                list: list
            });
        }


    }


    //Devuelve si es favorito o no un cierto evento
    this.get = function(id){

        var res = $localstorage.get('fav'+id,0);
        if(res==0 || res == "0"){
            return false;
        }
        else{
            return true;
        }


    }

    //Devuelve un array con los ids de los favoritos
    this.getList = function(){
        var obj = $localstorage.getObject('favList');
        return obj.list;
    }

}]);

module.service('EventService',['$http','$q',function($http,$q){

	var self = this;

	//Notas. Al refrescar se pierde porque se guarda en la memoria del navegador.
	//De todas formas en ionic no debería refrescarse, así que se consigue guardar.

	var start_day = 8;
	var finish_day = 15;

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
	//y retornar  a la funcion indicada
	this.process  = function(category,day,return_function){
	

		var previous_data = new Array();
		if(day!= -1){
			//Partimos de los datos de solo un día
			previous_data.push(data[day - start_day]);
		}
		else{
			//Partimos de los datos de todos los dias
			previous_data = data;

		}

		if(category!=CAT_ALL){
			var i;
			var j;
			var final_data = new Array();


			//Recorremos cada día
			for (i = 0; i < previous_data.length; i++){
				var day_data = new Array();
				for (j = 0; j< previous_data[i].length;j++){
					var current = previous_data[i][j];
					if(current.category == category){
						//Si es de la categoría, pusheamos
						day_data.push(current);
					}
				}
				final_data.push(day_data);

			}
			//Ahora nos quedamos con los de la categoría indicada

			//Para finalizar, se llamada a la funcion de retorno
			//con el resultado

			return_function(final_data);
		}
		else{
			//No hay categoría, no se filtra nada.
			return_function(previous_data);
		}
		return data;
		
	}

	//Se encarga de, una vez cargados los datos, obtener el evento especifico indicado
	//y retornar  a la funcion indicada
	this.find = function(id,return_function){

		var i = 0;
		var j = 0;
		var found = false;
		var result = undefined;
		while(i<data.length && !found){
			j = 0;
			while(j < data[i].length && !found){
				found = (data[i][j].id==id);
				if(found){
					result = data[i][j];
				}
				j++;
				
			}
			i++;


		}
	
		return_function(result);

	}


	
	//Se encarga de cargar los datos y, segun el modo,
	//realizar las operaciones necesarias.
	//mode: "getList", "get".
	//Segun el caso llamará a una funcion u otra al obtener los datos,
	//y le pasa la función return_function para poder avisar al controlador
	//que ha pedido el servicio.
 	this.loadData = function(mode,return_function){

 		
 		var deferred = $q.defer();

 		var promises = [ 
 			$http.get('appdata/8.json'),
			$http.get('appdata/9.json'),
			$http.get('appdata/10.json'),
			$http.get('appdata/11.json'),
			$http.get('appdata/12.json'),
			$http.get('appdata/13.json'),
			$http.get('appdata/14.json'),
			$http.get('appdata/15.json')
		]
		
		$q.all(promises).then(function(resp){
			var i;
			for(i = 0; i < resp.length; i++){
				data.push(resp[i].data);
			}
			is_data_loaded = true;
			if(mode=="getList"){
				self.process(current_category,current_day,return_function);
			}
			else if(mode=="get"){
				self.find(current_id,return_function);
			}
			

		});
		
	
	}

	


	/**FUNCIONES OFRECIDAS AL USUARIO */

	/* Provoca que se llame a la función return_function
	con un parámetro, que son la lista de eventos de la categoría
	indicada para el día establecido*/
	this.getList = function(category,day,return_function){


		if(is_data_loaded){
			//todo: procesamiento

			this.process(category,day,return_function);
			//return_function(data);
		}
		else{
			//todo: procesamiento
			current_category = category;
			current_day = day;
			self.loadData("getList",return_function);
		}


	}

	//Se encarga de la carga de solo un evento
	this.get = function(id,return_function){

		if(is_data_loaded){
			self.find(id,return_function);
		}
		else{
			current_id = id;
			self.loadData("get",return_function);
		}
	}



	/** Getters for constants */

	this.CAT_ALL = function(){
		return CAT_ALL;
	}

	this.DAYS_ALL = function(){
		return DAYS_ALL;
	}

	






}])

module.service('NotificationService',['EventService','$state',function(EventService,$state) {


	var month = 7; //Es uno menos
	var year = 2015;

	this.addReminder = function(id,adelanto){

		//Se obtiene el evento indicado
		this.afterLoad = function(data){
			//Llamada tras obtener datos de evento
			var event = data;

			//Se saca la hora y el minuto
			var time = event["hour"];

			var day = event["day"];
			var hour = getHour(time);
			var minute = getMinute(time);

			//Si la hora es las 24, se suma un dia y serán las 0:00
			//Si no lo es, se queda como esta, ya que a partir de las 0:01 esta marcado
			//en los datos como siguiente dia
			if(hour==24){
				day++;
				hour = 0;
			}


			var alarmTime = new Date(year, month, day, hour, minute, 0, 0);


			//Restamos para avisar antes
			var MS_PER_MINUTE = 60000;
			var finalAlarmTime = new Date(alarmTime.getTime() - adelanto * MS_PER_MINUTE);


				cordova.plugins.notification.local.schedule({
					id: id, //El id es el id del evento
					date: finalAlarmTime,
					message: event["title"],
					title: "Evento a las " + hour + ":" + minute,
					autoCancel: true
				});


			cordova.plugins.notification.local.on("click", function (notification, state) {
					//Llamado al clickar en una notificacion, abre la pantalla de detalle
					$state.go('app.eventDetail', {eventId:notification.id})


			}, this);



		}

		EventService.get(id,this.afterLoad);



	}

	this.removeReminder = function(id){
		cordova.plugins.notification.local.cancel(id, function () {
			// Se cancela la notificacion
		});
	}


	//Llama a la funcion callback con el resultado true o false de si está definido el recordatorio
	this.isScheduled =  function(id,callback){
		cordova.plugins.notification.local.isPresent(id, callback);
	}


	//Funciones privadas

	//Devuelve la hora dada una cadena de hora
	var getHour = function(hour_text){
		dosPuntos = hour_text.indexOf(":");
		if(dosPuntos> -1) {
			var hora = hour_text.substr(0, dosPuntos);
			return hora;
		}
		return undefined;
	}

	//Devuelve el minuto dada una cadena de hora
	var getMinute = function(hour_text){
		dosPuntos = hour_text.indexOf(":");
		if(dosPuntos> -1) {
			var minutos = hour_text.substr(dosPuntos +1,dosPuntos +1 +2);
			return minutos
		}
		return undefined;
	}




}]);

  

