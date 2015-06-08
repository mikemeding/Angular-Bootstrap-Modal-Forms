(function () {
    'use strict';

    var app = angular.module('YOUR APP');
    app.service('EnergymatesDataService', ['ModalService', function (ModalService) { // bring in ModalService as a dependency

        // submit functions
        this.addOnSubmit = function (data) {
            console.log(data);
        };
        this.editOnSubmit = function (data) {
            console.log(data);
        };

        var model =
        {
            fields: [
                {name: 'id', display: false},
                {name: 'name', displayName: 'Name', placeholder: 'Energymate Name', type: 'text', required: true},
                {name: 'macA', displayName: 'Mac A', placeholder: '0x11300xxx', type: 'text'},
                {name: 'macB', displayName: 'Mac B', placeholder: '0x11300xxx', type: 'text'},
                {name: 'macC', displayName: 'Mac C', placeholder: '0x11300xxx', type: 'text'},
                {name: 'upstreamMac', displayName: 'Upstream Mac', placeholder: '0x33000xxx', type: 'text'},
                {name: 'sign1', displayName: 'Sign 1', type: 'dropdown', dropdownOptions: ['-1.0', '0.0', '1.0']},
                {name: 'sign2', displayName: 'Sign 2', type: 'dropdown', dropdownOptions: ['-1.0', '0.0', '1.0']},
                {name: 'sign3', displayName: 'Sign 3', type: 'dropdown', dropdownOptions: ['-1.0', '0.0', '1.0']},
                {name: 'breakerNumber', displayName: 'Breaker Number', placeholder: '5', type: 'text'},
                {name: 'excludeFromRollup', displayName: 'Exclude From Rollups?', type: 'checkbox'},
                {
                    name: 'dynUpInterest',
                    displayName: 'Dynamic Update Interest',
                    type: 'dropdown',
                    dropdownOptions: ['DEFAULT', 'LOW120', 'MID120', 'HIGH120', 'LOW277', 'MID277', 'HIGH277']
                }
            ],
            addModalSettings: {
                title: 'Add New Energymate',
                callback: this.addOnSubmit
            },
            editModalSettings: {
                title: 'Edit Energymate',
                callback: this.editOnSubmit
            }

        };

        // compile and update our model
        model = ModalService.compileModel(model);

        // this method must be implemented
        this.getModel = function () {
            return model;
        };

    }]);
}());
