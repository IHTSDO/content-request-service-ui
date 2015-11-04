'use strict';

angular
    .module('conceptRequestServiceApp.request', [
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/requests/:requestId/:mode', {
                templateUrl: 'components/request/request-details.html',
                controller: 'RequestCtrl',
                controllerAs: 'request'
            });
    })
    .controller('RequestCtrl', [
        '$rootScope',
        '$routeParams',
        'requestService',
        'notificationService',
        function ($rootScope, $routeParams, requestService, notificationService) {
            var vm = this;
            var requestId =  $routeParams.requestId;

            var initView = function () {
                $rootScope.pageTitles = ['Edit Requests', requestId];
                loadRequest();
            };

            var loadRequest = function () {
                notificationService.sendMessage('Loading request ' + requestId + '...', 0);

                vm.request = null;
                requestService.getRequest(requestId).then(function (request) {
                    vm.request = request;

                    notificationService.sendMessage('Request loaded', 5000);
                });
            };

            initView();
        }
    ]);