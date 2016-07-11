/*
 *Fichero con declaracion de los modulos de la aplicacion.
 *
 * Copyright (C) <2015> <Ismael Rodríguez Hernández>
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */
var app = angular.module('app', ['ionic', 'app.controllers','app.services','ionic-native-transitions','ngCordova']);
var controllers = angular.module('app.controllers', []);
var services = angular.module('app.services', []);
var directives = angular.module('app.directives', []);
