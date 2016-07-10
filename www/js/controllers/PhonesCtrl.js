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
                "title": "Guardia Civil",
                "phone": "062"
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
                "phone": "974 221 540"
            },
            {
                "title": "Bomberos",
                "phone": "974 220 000"
            },
            {
                "title": "Cruz Roja",
                "phone": "974 221 186"
            },
        ]
    };


    //Telefonos de hospitales
    var hospitales = {
        "name": "Hospitales y ambulatorios",
        "phones": [

            {
                "title": "Hospital General San Jorge",
                "phone": "974 247 000"
            },
            {
                "title": "Hospital Sagrado Corazón de Jesús",
                "phone": "974 292 000"
            },
            {
                "title": "Clínica Santiago",
                "phone": "974 220 600"
            },
            {
                "title": "Centro de salud Pirineos",
                "phone": "974 221 922"
            },
            {
                "title": "Centro de salud Santo Grial",
                "phone": "974 244 122"
            },
            {
                "title": "Centro de salud Perpetuo Socorro",
                "phone": "974 225 450"
            },
            {
                "title": "Centro de salud Huesca Rural",
                "phone": "974 228 672"
            }
        ]
    };

    //Telefonos de transportes
    var transportes = {
        "name": "Transportes",
        "phones": [

            {
                "title": "RENFE",
                "phone": "902 24 05 05"
            },
            {
                "title": "Estación de autobuses",
                "phone": "974 210 700"
            },
            {
                "title": "Taxis",
                "phone": "974 595 959"
            }
        ]


    };

    //Telefonos de informacion
    var informacion = {
        "name": "Información",
        "phones": [

            {
                "title": "Ayuntamiento de Huesca",
                "phone": "974 292 100"
            },
            {
                "title": "Turismo",
                "phone": "974 292 170"
            },
            {
                "title": "Fiestas (ayuntamiento)",
                "phone": "974 292 130"
            }
        ]
    };


    $scope.phones = [emergencias, informacion, transportes, hospitales];

    //Abre el marcador con el numero indicado
    $scope.call = function (phone) {
        window.open("tel: " + phone, "_system");
    }


}]);
