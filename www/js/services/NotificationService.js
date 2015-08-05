
/**
 * Servicio de notificaciones. Se encarga de gestionar los recordatorios.
 */
services.service('NotificationService', ['EventService', '$state', function (EventService, $state) {


    var month = 7; //Es uno menos, 7 es Agosto
    var year = 2015;

    /**
     * Añade un recordatorio para el evento "id" con un adelanto de "adelanto" minutos.
     */
    this.addReminder = function (id, adelanto) {

        //Funcion llamada al obtener los datos del evento.
        this.afterLoad = function (data) {

            var event = data;

            //Se saca la hora y el minuto
            var time = event["hour"];

            var day = event["day"];
            var hour = getHour(time);
            var minute = getMinute(time);

            //Si la hora es las 24, se suma un dia y serán las 0:00
            //Si no lo es, se queda como esta, ya que a partir de las 0:01 esta marcado
            //en los datos como siguiente dia
            if (hour == 24) {
                day++;
                hour = 0;
            }


            var alarmTime = new Date(year, month, day, hour, minute, 0, 0);


            //Restamos para avisar antes
            var MS_PER_MINUTE = 60000;
            var finalAlarmTime = new Date(alarmTime.getTime() - adelanto * MS_PER_MINUTE);


            //Se programa la notificacion
            cordova.plugins.notification.local.schedule({
                id: id, //El id es el id del evento
                date: finalAlarmTime,
                message: event["title"],
                title: "Evento a las " + hour + ":" + minute,
                autoCancel: true
            });


            //Llamado al clickar en una notificacion, abre la pantalla de detalle
            cordova.plugins.notification.local.on("click", function (notification, state) {
                $state.go('app.eventDetail', {eventId: notification.id})


            }, this);


        };

        //Carga el evento para obtener sus datos
        EventService.get(id, this.afterLoad);


    };

    //Cancela una notificacion
    this.removeReminder = function (id) {
        cordova.plugins.notification.local.cancel(id, function () {
            // Se cancela la notificacion
        });
    };


    //Llama a la funcion callback con el resultado true o false de si está definido el recordatorio
    this.isScheduled = function (id, callback) {
        cordova.plugins.notification.local.isPresent(id, callback);
    };


    //Funciones privadas

    //Devuelve la hora dada una cadena de hora
    var getHour = function (hour_text) {
        dosPuntos = hour_text.indexOf(":");
        if (dosPuntos > -1) {
            return hour_text.substr(0, dosPuntos);

        }
        return undefined;
    };

    //Devuelve el minuto dada una cadena de hora
    var getMinute = function (hour_text) {
        dosPuntos = hour_text.indexOf(":");
        if (dosPuntos > -1) {
            return hour_text.substr(dosPuntos + 1, 2);
        }
        return undefined;
    }


}]);

  
