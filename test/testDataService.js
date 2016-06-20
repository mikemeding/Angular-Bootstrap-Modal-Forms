(function () {
    'use strict';

    var app = angular.module('app');
    
    app.service('TestDataService', ['ModalService', function (ModalService) { // bring in ModalService as a dependency (contains compiler)

        // submit functions
        this.addOnSubmit = function (data) {
            console.log(data);
        };
        this.editOnSubmit = function (data) {
            console.log(data);
        };

        var model = {
            fields: [
                // making display false preserves the data but does not display it
                {
                    name: "id",
                    display: false
                },

                // what a checkbox boolean looks like
                {
                    name: "active",
                    type: "checkbox",
                    displayName: "Active?"
                },
                {
                    name: "customerName",
                    displayName: "Customer Name",
                    placeholder: "Please enter a persons name.",
                    type: "text",
                    required: true // constraints can be added as well
                },
                {
                    name: "street",
                    displayName: "Street",
                    type: "text",
                    placeholder: "123 Street Rd"
                },
                {
                    name: "city",
                    displayName: "City",
                    type: "text",
                    placeholder: "kalamazoo"
                },

                // a dropdown with many options example
                {
                    name: "usState",
                    displayName: "State",
                    type: "dropdown",
                    dropdownOptions: [
                        "AL", "AK", "AS", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FM", "FL", "GA", "GU", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MH", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "MP", "OH", "OK", "OR", "PW", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VI", "VA", "WA", "WV", "WI", "WY"
                    ]
                },
                {
                    name: "email",
                    displayName: "Email",
                    type: "text",
                    placeholder: "example@gmail.com"
                },
                {
                    name: "phone",
                    displayName: "Phone",
                    type: "text",
                    placeholder: "(999)999-9999"
                }],

            // the callback functions are defined above
            addModalSettings: {
                title: 'Add New Person',
                callback: this.addOnSubmit
            },
            editModalSettings: {
                title: 'Edit Person',
                callback: this.editOnSubmit
            }

        };

        // you must compile and update your model
        model = ModalService.compileModel(model);

        // this method must be implemented to allow external access to your model
        this.getModel = function () {
            return model;
        };

    }]);
}());
/**
 * Created by mike on 6/20/16.
 */
