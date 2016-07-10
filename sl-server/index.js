/**
 * @author Ismael Rodríguez Hernández, 587429
 * Archivo que lanza el servidor web y el servidor de API REST.
 * Para el servidor web define a su vez los manejadores para cada endpoint,
 * los métodos disponibles y si requiere estar logueado.
 */

//Importamos los módulos del servidor
var apiServer = require("./apiServer");

//Iniciamos el servidor de API REST
apiServer.start(8889);
