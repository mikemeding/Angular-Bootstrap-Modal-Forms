/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Mike Meding
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Change Log:
 * Mon Aug 10 2015 Mike Meding <mikeymeding@gmail.com>
 * - initial beta version release
 */
(function () {
    "use strict";
    var module = angular.module("eos");
    module.directive('modal', function () {
        /**
         * Credits and Examples used:
         * http://stackoverflow.com/questions/14115701/angularjs-create-a-directive-that-uses-ng-model // directives that use ng-model
         * http://stackoverflow.com/questions/20033493/angularjs-passing-service-as-an-argument-to-directive // for argument passing
         * http://www.html5rocks.com/en/tutorials/es6/promises/#toc-async // learning about promises
         * http://stackoverflow.com/questions/26807524/twitter-bootstrap-3-modal-with-scrollable-body // css modal body scrollbar magic
         * http://stackoverflow.com/questions/16529825/angularjs-ngclass-conditional // angular conditional classes for template
         * http://stackoverflow.com/questions/12139152/how-to-set-the-value-property-in-angularjs-ng-options // using ngOptions for select tags
         * http://odetocode.com/blogs/scott/archive/2013/06/19/using-ngoptions-in-angularjs.aspx // using ngOptions for select tags
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
                    $scope.dataService = $injector.get($scope.dataServiceName);

                    /**
                     * Opens the modal
                     * Based on the code from:
                     * http://angular-ui.github.io/bootstrap/#/modal
                     */
                    $scope.openModal = function () {

                        function onwards() {
                            $modal.open({
                                // this template is constructed from modalTemplate.html by converting the HTML into a giant string.
                                template: '<div class="modal-header">     <div class="row">         <div class="col-lg-9">             <h3 class="modal-title">{{title}}</h3>         </div>         <div class="col-lg-3">             <h5 class="pull-right"><strong class="text-info">BLUE</strong> means required</h5>         </div>     </div> </div>  <div class="modal-body">       <form>         <!--Loop over all fields in the data model-->         <div class="form-group" ng-class="{\'has-error\' : !field.valid}" ng-repeat="field in fields"              ng-if="field.display">              <!--for boolean attributes-->             <input ng-if="field.type == \'checkbox\'" type="checkbox" ng-model="field.value">              <!--Field Label-->             <label ng-class="{\'text-info\' : field.required && field.valid, \'text-default\' : !field.required && field.valid , \'text-danger\': !field.valid}"                    for="{{field.name}}">{{field.displayName}} </label>              <!--Error message-->             <div ng-if="field.hasOwnProperty(\'errorMessage\')" class="alert alert-danger alert-dismissible fade in" role="alert">                 <strong>Error!</strong> {{field.errorMessage}}             </div>              <!--Create an input field for text and number attributes-->             <input ng-if="field.type == \'text\' || field.type == \'number\'" type="{{field.type}}" class="form-control"                    placeholder="{{field.placeholder}}" id="{{field.name}}" ng-model="field.value">              <!--Create a dropdown field for dropdown attributes using dropdownOptions attribute-->             <select class="form-control" ng-if="field.type == \'dropdown\'" data-ng-model="field.value" data-ng-options="item for item in field.dropdownOptions">             </select>              <!--for datetime picker-->             <input ng-if="field.type == \'datetime\'" class="form-control" type="datetime-local" ng-model="field.value">          </div>     </form> </div>  <!--modal footer--> <div class="modal-footer">     <button type="submit" class="btn btn-primary" ng-click="ok(fields)">OK</button>     <button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button> </div>',
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
                        }

                        /**
                         * if preClick exists execute it
                         */
                        if (typeof $scope.dataService.preClick === "function") { // if preclick function exists
                            $scope.dataService.preClick();
                        }


                        function myTimeout() {
                            setTimeout(function () {
                                if (!$scope.ready) {
                                    $scope.ready = $scope.dataService.modelReady(); // if still not ready update
                                    myTimeout(); // run again
                                } else {
                                    onwards(); // continue execution.
                                }
                            }, 100); // 100ms wait
                        }

                        /**
                         * get relevant data for building our modal from our injected service
                         * and do not return until that data is ready
                         */
                        if (typeof $scope.dataService.modelReady === 'function') {
                            $scope.ready = $scope.dataService.modelReady();
                            myTimeout(); // kick off synchronous timer
                        } else {
                            onwards(); // ignore and continue
                        }


                    };
                }
            ],
            link: function compile($scope, element, $attrs, ctrl) {

                // bind the click handler to the element which has our modal-add attribute
                element.bind('click', function (e) {
                    $scope.openModal(); // just open the stupid modal
                });
            }
        }
    });
    /**
     * The per instance modal controller. This handles the actual submission of the data
     */
    module.controller("AddModalInstanceController", ['$scope', '$modalInstance', '$http', '$state', '$injector', 'dataServiceName', 'ngModel', 'ModalService',
        function ($scope, $modalInstance, $http, $state, $injector, dataServiceName, ngModel, ModalService) {
            // using service name to inject the service to our instance controller.
            var dataService = $injector.get(dataServiceName);

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
                        if ($scope.settings.hasOwnProperty('callback')) {
                            $scope.settings['callback'](newDataPoint); // fire off successful callback function
                        }
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
