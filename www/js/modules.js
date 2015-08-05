/*
Fichero con declaracion de los modulos de la aplicacion.
 */
var app = angular.module('app', ['ionic', 'app.controllers','app.services']);
var controllers = angular.module('app.controllers', []);
var services = angular.module('app.services', []);