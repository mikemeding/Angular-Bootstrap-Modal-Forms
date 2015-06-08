/**
 * Created by mike on 5/26/15.
 */
(function () {
    "use strict";
    var app = angular.module("eos");
    app.directive('modal', function () {
        /**
         * Modal Directive:
         * This directive requires that you pass a service which implements these methods and follows the following instructions:
         *
         * PULL IN SERVICE
         * Your service must bring in the ModalService dependency which contains the model compiler
         *
         * IMPLEMENT METHODS
         * JSON getModel(); // will return the model
         * JSON getAllData(); // will return an array of objects which correspond to the model
         * void addData(JSON); // adds data to your internal data array
         *
         * MODEL STRUCTURE
         * var model = {
             fields: [
         *        {name: "id", display: false},
         *        {name: "name", displayName: "Name", placeholder: "Panel [a,b,etc...]", type: "text", required: true},
         *        {name: "mac", displayName: "MAC", placeholder: "0x36000...", type: "text", required: true}
         *        ],
         *   addModalSettings: {
         *       title: 'Add New Panel',
         *       buttonLabel: 'Add Panel',
         *       callback: this.onSubmit
         *   },
         *   editModalSettings: {
         *      ...
         *   }
         * };
         *
         * COMPILE MODEL
         * model = ModalService.compileModel(model);
         *
         * ATTACH TO DOM
         * <button class="btn btn-primary" modal ng-service="PanelDataService">Add Panel</button>
         *
         * RECOMMENDED
         * Hanging the rest of the data used to drive around your page using your new service is recommended as your
         * modals will stay up to date with your data.
         *
         * Credits and Examples used:
         * http://stackoverflow.com/questions/14115701/angularjs-create-a-directive-that-uses-ng-model // directives that use ng-model
         * http://stackoverflow.com/questions/20033493/angularjs-passing-service-as-an-argument-to-directive // for argument passing
         * http://www.html5rocks.com/en/tutorials/es6/promises/#toc-async // learning about promises
         * http://stackoverflow.com/questions/26807524/twitter-bootstrap-3-modal-with-scrollable-body // css modal body scrollbar magic
         * http://stackoverflow.com/questions/16529825/angularjs-ngclass-conditional // angular conditional classes for template
         * http://stackoverflow.com/questions/12139152/how-to-set-the-value-property-in-angularjs-ng-options // using ngOptions for select tags
         * http://odetocode.com/blogs/scott/archive/2013/06/19/using-ngoptions-in-angularjs.aspx // using ngOptions for select tags
         *
         */

        return {
            restrict: 'A',
            scope: {
                ngService: '@',
                ngModel: '=' // puts object directly in scope
            },
            controller: [
                '$scope', '$attrs', '$injector', '$modal', function ($scope, $attrs, $injector, $modal) {
                    // inject service and get button label for this scope
                    $scope.dataServiceName = $attrs.ngService;
                    //$scope.dataService = $injector.get($attrs.ngService);

                    /**
                     * Opens the modal
                     * Based on the code from:
                     * http://angular-ui.github.io/bootstrap/#/modal
                     */
                    $scope.openModal = function () {

                        // this is simalar to routes except with dynamic templates.
                        var modalInstance = $modal.open({
                            templateUrl: 'app/private/modules/modal/modalTemplate.html',
                            controller: 'AddModalInstanceController',
                            size: 'lg',
                            resolve: { // this resolves the local vars of Instance Ctrl
                                ngModel: function () {
                                    return $scope.ngModel;
                                },
                                dataServiceName: function () { // send the modal instance the name of the service that it must inject
                                    return $scope.dataServiceName;
                                }
                            }

                        });
                    };
                }],
            link: function ($scope, element, attributes, ctrl) {
                // bind the click handler to the element which has our modal-add attribute
                element.bind('click', function (e) {
                    //console.log(e);
                    $scope.openModal();
                });
            }
        }
    });
    /**
     * The per instance modal controller. This handles the actual submission of the data
     */
    app.controller("AddModalInstanceController", ['$scope', '$modalInstance', '$http', '$state', '$injector', 'dataServiceName', 'ngModel', 'ModalService',
        function ($scope, $modalInstance, $http, $state, $injector, dataServiceName, ngModel, ModalService) {
            // using service name to inject the service to our instance controller.
            var dataService = $injector.get(dataServiceName);

            // get relevant data for building our modal from our injected service
            var model = dataService.getModel();

            // extract relevant settings
            $scope.fields = model['fields'];
            if (ngModel === undefined) {
                //console.log('add modal');
                $scope.settings = model['addModalSettings'];
            } else {
                //console.log('edit modal');
                $scope.settings = model['editModalSettings'];
                // set field values based on given model
                $scope.fields = ModalService.addValuesToFields(ngModel, $scope.fields);
                //console.log(ngModel);
                //console.log($scope.fields);
            }
            $scope.title = $scope.settings['title'];

            $scope.cancel = function () {// when cancel button is clicked
                $modalInstance.dismiss('cancel'); // this causes result promise to fail
            };

            $scope.ok = function (fields) { // when ok button is clicked
                var newDataPoint = ModalService.getValuesFromFields(fields); // Extract data from fields

                /**
                 * Checks only our requirements for validity
                 */
                var preformValidityCheckAndCallback = function () { // yay for long pointless function names
                    // only do requirements validation
                    $scope.fields = ModalService.checkValidRequirements($scope.fields); // call our requirements validation

                    if (!ModalService.checkValidFromFields($scope.fields)) { // If any invalid states exist
                        //console.error('invalid states exist');
                        $scope.fields = fields;
                    } else {
                        $scope.settings['callback'](newDataPoint); // fire off successful callback function
                        $modalInstance.close(); // this causes result promise to succeed and modal to close and reset
                    }
                };

                // if user validation exists
                if ('validate' in $scope.settings) {
                    $scope.fields = ModalService.resetValidity(fields); // reset validity fields for re-evaluation
                    $scope.fields = $scope.settings['validate']($scope.fields); // call user defined validation service to update fields
                    preformValidityCheckAndCallback();
                } else {
                    $scope.fields = ModalService.resetValidity(fields); // reset validity fields for re-evaluation
                    preformValidityCheckAndCallback();
                }
            };

            // MODAL PROMISE
            $modalInstance.result.then(function (results) { // if successful submission
                $scope.fields = ModalService.resetModel(dataService.getModel()); // Reset modal
            }, function (err) { // if modal fails due to cancel or outside click
                $scope.fields = ModalService.resetModel(dataService.getModel()); // Reset modal
            })


        }]);

}());