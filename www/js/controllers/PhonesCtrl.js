/**
 * Controlador de la pantalla de telefonos de interes.
 *
 *
 * Copyright (C) <2015> <Ismael Rodríguez Hernández>
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */
controllers.controller('PhonesCtrl', ["$scope",function ($scope) {

    //Telefonos de emergencias
    var emergencias = {
        "name": "Emergencias",
        "phones": [
            {
                "title": "Emergencias",
                "phone": "112"
            },
            {
                "title": "Ambulancias Zaragoza",
                "phone": "061"
            },
            {
                "title": "Policía Nacional",
                "phone": "091"
            },
            {
                "title": "Policía Local",
                "phone": "092"
            },
            {
                "title": "Protección Civil",
                "phone": "976 721 669"
            },
            {
                "title": "Bomberos",
                "phone": "080"
            },
            {
                "title": "Cruz Roja",
                "phone": "976 222 222"
            }
            
        ]
    };


    
    //Telefonos de transportes
    var transportes = {
        "name": "Transportes",
        "phones": [

            {
                "title": "RENFE",
                "phone": "902 240 202"
            },
            {
                "title": "Estación de autobuses",
                "phone": "976 592 727"
            },
            {
                "title": "Cooperativa Taxis",
                "phone": "976 757 575"
            },
            {
                "title": "Radio Taxi Zaragoza",
                "phone": "976 42 42 42"
            }
        ]


    };

    //Telefonos de informacion
    var informacion = {
        "name": "Información",
        "phones": [

            {
                "title": "Ayuntamiento de Zaragoza",
                "phone": "010"
            },
            {
                "title": "Turismo",
                "phone": "976 201 200"
            }
            
        ]
    };


    $scope.phones = [emergencias, informacion, transportes];

    //Abre el marcador con el numero indicado
    $scope.call = function (phone) {
        window.open("tel: " + phone, "_system");
    }


}]);
