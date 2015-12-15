'use strict';

angular
    .module('conceptRequestServiceApp.batch')
    .controller('BatchDetailsCtrl', [
        '$rootScope',
        '$filter',
        '$routeParams',
        '$location',
        'ngTableParams',
        'batchService',
        'requestService',
        'notificationService',
        'accountService',
        'CRS_ROLE',
        function ($rootScope, $filter, $routeParams, $location, ngTableParams, batchService, requestService, notificationService, accountService, CRS_ROLE) {
            var vm = this;

            var initView = function () {
                $rootScope.pageTitles = ['Batch Details', $routeParams.batchId];
            };

            var editRequest = function (requestId) {
                $location.path('requests/edit/' + requestId);
            };

            var requestTableParams = new ngTableParams({
                    page: 1,
                    count: 10,
                    sorting: {'requestHeader.requestDate': 'desc', batchRequest: 'asc', id: 'asc'}
                },
                {
                    filterDelay: 700,
                    getData: function (params) {
                        var sortingObj = params.sorting();
                        var sortFields = [], sortDirs = [];

                        if (sortingObj) {
                            angular.forEach(sortingObj, function (dir, field) {
                                sortFields.push(field);
                                sortDirs.push(dir);
                            });
                        }

                        return batchService.getBatch($routeParams.batchId, params.page() - 1, params.count(), params.filter().search, sortFields, sortDirs).then(function (requests) {
                            params.total(requests.total);
                            if (requests.items && requests.items.length > 0) {
                                if (!vm.batchHeader) {
                                    vm.batchHeader = requests.items[0].requestHeader;
                                    vm.batchHeader.batchRequest = requests.items[0].batchRequest;
                                }

                                return requests.items;
                            } else {
                                return [];
                            }
                        }, function () {
                            return [];
                        });
                    }
                }
            );


            vm.tableParams = requestTableParams;
            vm.batchHeader = null;
            vm.editRequest = editRequest;

            initView();
        }
    ]);