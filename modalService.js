/**
 * Created by mike on 5/28/15.
 */
(function () {
    var app = angular.module('eos');
    app.service('ModalService', [function () {
        /**
         * Check that the model has the correct syntax for display
         * This serves only as a basic compile. This will need to become far more complex and involved
         * @param model
         */
        this.compileModel = function (model) {
            var compileError = false;
            for (x = 0; x < model['fields'].length; x++) {
                var field = model['fields'][x];  // shallow copy
                // if dropdown = type then dropdownOptions must also exist and contain at least 1 value
                if (field['type'] === 'dropdown' && !('dropdownOptions' in field)) { // if our type is a dropdown
                    console.error('MODAL ERROR: dropdown field [' + field[name] + '] must have dropdownOptions Array');
                    compileError = true;
                }
                // name must exist
                if (!('name' in field)) {
                    console.error('MODAL ERROR: name field must exist in field [' + JSON.stringify(field) + ']');
                    compileError = true;
                }
                // type must exist if display is true
                if (!('type' in field) && field['display']) {
                    console.error('MODAL ERROR: type field must exist in field [' + JSON.stringify(field) + ']');
                    compileError = true;
                }
            }
            if (compileError) {
                return {};
            } else {
                return addDefaultFields(model); // add default fields and return
            }

        };

        /**
         * Add all default field parameters if they do not already exist
         * @param model
         * @returns {*} the updated model
         */
        var addDefaultFields = function (model) {
            var updatedFields = {};
            for (var x = 0; x < model['fields'].length; x++) {
                var field = model['fields'][x];  // shallow copy
                if (!('display' in field)) { // if display field does not exist
                    field['display'] = true;
                }
                if (!('valid' in field)) { // for validation purposes
                    field['valid'] = true;
                }
                if (!('required' in field)) { // if required field does not exist
                    field['required'] = false;
                }
                if (!('displayName' in field)) { // if displayName field does not exist
                    field['displayName'] = field['name']; // use required name field
                }
                if (!('placeholder' in field)) { // if placeholder field does not exist
                    field['placeholder'] = 'Please enter a value';
                }
                if (field['type'] === 'dropdown') { // if our type is a dropdown
                    field['value'] = field['dropdownOptions'][0]; // its inital value is the first item in dropdown options
                }
                if (field['type'] === 'checkbox') { // if our type is a checkbox
                    field['value'] = false;
                }
            }
            return model;
        };

        /**
         * Cleans up and returns our model so that it may be used upon reset.
         * @param model
         */
        this.resetModel = function (model) {
            for (var x = 0; x < model['fields'].length; x++) {
                var field = model['fields'][x];  // shallow copy
                if (field['type'] === 'dropdown') {
                    field['value'] = field['dropdownOptions'][0]; // its inital value is the first item in dropdown options
                } else {
                    delete field['value']
                }
                field['valid'] = true; // reset valid flag
                delete field['errorMessage']; // remove any error messages
            }
            return model;
        };


        /**
         * Returns an object representing all the value fields of the given model
         * @param fields is an array of fields
         */
        this.getValuesFromFields = function (fields) {
            var valueObj = {};
            for (var x = 0; x < fields.length; x++) { // for all fields
                var field = fields[x];  // shallow copy
                if ('value' in field) {
                    valueObj[field['name']] = field['value']; // creates key value pairs
                } else if (field['type'] === 'checkbox') { // if checkbox that has no value
                    valueObj[field['name']] = false; // default false
                }

            }
            return valueObj;
        };

        /**
         * Checks to see if all the fields have the valid flag set to true. returns false otherwise.
         * @param fields
         * @returns {boolean}
         */
        this.checkValidFromFields = function (fields) {
            var valid = true;
            for (var x = 0; x < fields.length; x++) { // for all fields
                var field = fields[x];  // shallow copy
                if (!field['valid']) { // if false field exists
                    valid = false;
                }
            }
            return valid;
        };

        /**
         * Requirements check. This goes through and finds any fields marked as required and errors them out if
         * they have not been filled out.
         * @param fields
         * @returns {*}
         */
        this.checkValidRequirements = function (fields) {
            for (var x = 0; x < fields.length; x++) { // for all fields
                var field = fields[x];  // shallow copy
                if ('required' in field) { // if the field is required
                    if (field['required'] && field['valid'] && !('value' in field)) { // and it has no value and is still valid
                        field['valid'] = false; // invalidate field
                        field['errorMessage'] = 'This field is required';
                    }
                }
            }
            return fields;
        };

        /**
         * Reset valid fields only for revalidation purposes
         * @param fields
         */
        this.resetValidity = function (fields) {
            for (var x = 0; x < fields.length; x++) { // for all fields
                var field = fields[x];  // shallow copy
                field['valid'] = true;
                delete field['errorMessage'];
            }
            return fields;
        };

        /**
         * Matches the names of those in values with those in fields adding values to fields.
         * @param values
         * @param fields
         */
        this.addValuesToFields = function (values, fields) {
            for (var x = 0; x < fields.length; x++) { // for all fields
                var field = fields[x];  // shallow copy
                for (var key in values) {
                    if (values.hasOwnProperty(key)) { // not sure why this needs to be set
                        if (field['name'] === key) {
                            //console.log('matched: ' + field['name']);
                            field['value'] = values[key]; // set value accordingly
                        }
                    }
                }
            }
            return fields;
        };


    }
    ])
    ;

}());
