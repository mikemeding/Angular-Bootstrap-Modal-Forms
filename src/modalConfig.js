/**
 * Created by mike on 6/20/16.
 */
(function () {
    'use strict';

    // This creates the autoModals module with correct dependencies to make AnBoMoFo work.
    // It must be included before all other files in this directory.
    angular.module('autoModals', ['ui.bootstrap', 'ui.router']);
}());