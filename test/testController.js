/**
 * Created by mike on 6/20/16.
 */
(function () {
    'use strict';
    var app = angular.module('app', ['ui.bootstrap', 'autoModals', 'ui.router']);

    app.controller('TestController', ['TestDataService', '$scope', '$http', function (TestDataService, $scope, $http) {

        $scope.customers = [];

        // fetch our data from the customers.json
        $scope.fetchCustomers = function () {
            var request = {
                method: 'GET',
                url: 'customers.json'
            };
            $http(request)
                .success(function (data, status, headers, config, response) {
                    $scope.customers = data.list;
                })
                .error(function (data, status, headers, config, response) {
                    console.error("Failed getting customers.json file");
                });
        };
        $scope.fetchCustomers(); // on page load

    }]);
}());