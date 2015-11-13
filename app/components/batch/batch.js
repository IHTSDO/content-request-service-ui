'use strict';

angular
    .module('conceptRequestServiceApp.batch', [
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/batches/:batchId/:mode', {
                templateUrl: 'components/batch/batch-details.html',
                controller: 'BatchCtrl',
                controllerAs: 'batch'
            });
    })
    .controller('BatchCtrl', [
        '$rootScope',
        '$routeParams',
        'batchService',
        'notificationService',
        function ($rootScope, $routeParams, batchService, notificationService) {
            var vm = this;
            var batchId =  $routeParams.batchId;

            var initView = function () {
                $rootScope.pageTitles = ['View Batch', batchId];
                loadBatch();
            };

            var loadBatch = function () {
                notificationService.sendMessage('Loading batch ' + batchId + '...', 0);

                vm.batch = null;
                batchService.getBatch(batchId).then(function (batch) {
                    vm.batch = batch;

                    notificationService.sendMessage('Batch loaded', 5000);
                });
            };

            initView();
        }
    ]);