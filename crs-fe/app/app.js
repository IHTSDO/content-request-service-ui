'use strict';

/**
 * @ngdoc overview
 * @name conceptRequestServiceApp
 * @description
 * # conceptRequestServiceApp
 *
 * Main module of the application.
 */
angular
    .module('conceptRequestServiceApp', [
        'ngAnimate',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',

        // dependencies
        'ui.bootstrap',
        'ngTable',

        // layouts

        // components
        'conceptRequestServiceApp.dashboard',
        'conceptRequestServiceApp.userPreferences',
        'conceptRequestServiceApp.request',
        'conceptRequestServiceApp.batch',
        'conceptRequestServiceApp.notification',

        // shared
        'conceptRequestServiceApp.imsAuthentication',
        'conceptRequestServiceApp.configuration'

    ])
    .config(function ($routeProvider, $modalProvider) {
        // set the default redirect/route
        $routeProvider
            .otherwise({
                redirectTo: '/dashboard'
            });

        // modal providers MUST not use animation
        // due to current angular-ui bug where the
        // animation prevents removal of grey backdrop on close
        $modalProvider.options.animation = false;
    })
    .run([
        '$rootScope',
        '$location',
        'accountService',
        function ($rootScope, $location, accountService) {

            $rootScope.showLoading = false;
            $rootScope.showSplash = true;
            $rootScope.pageTitles = [];

            if (!accountService.isCredentialChecked()) {
                $rootScope.showSplash = true;

                accountService.checkCredential().then(function () {
                    // inform other components that account info has been changed
                    $rootScope.$broadcast('crs:accountInfoChanged');

                    if (accountService.isUserLoggedIn()) {
                        $rootScope.showSplash = false;
                    } else {
                        $location.path('/login');
                    }
                });
            }
        }
    ]);