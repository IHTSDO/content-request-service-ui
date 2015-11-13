'use strict';

angular
    .module('conceptRequestServiceApp.imsAuthentication', [])
    .config(function ($routeProvider) {


        $routeProvider
            .when('/login', {
                template: '',
                controller: 'ImsRoutCtrl'
            })
            .when('/logout', {
                template: '',
                controller: 'ImsRoutCtrl'
            })
            .when('/settings', {
                template: '',
                controller: 'ImsRoutCtrl'
            })
            .when('/register', {
                template: '',
                controller: 'ImsRoutCtrl'
            });
    })
    .controller('ImsRoutCtrl', [
        '$window',
        '$location',
        'configService',
        function ($window, $location, configService) {
            var imsUrl = configService.getEndpointConfig('ims');
            var imsUrlParams = '?serviceReferer=' + $window.location.origin;
            var path = $location.path();

            $window.location.href = decodeURIComponent(imsUrl + '#' + path + imsUrlParams);
            //console.log($window.location);
            //console.log(decodeURIComponent(imsUrl + '#' + path + imsUrlParams));
        }
    ]);