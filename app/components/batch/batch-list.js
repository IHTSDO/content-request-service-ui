'use strict';

angular
    .module('conceptRequestServiceApp.batch')
    .controller('BatchListCtrl', [
        '$filter',
        'ngTableParams',
        'batchService',
        'notificationService',
        function ($filter, ngTableParams, batchService, notificationService) {
            var vm = this;

            var batchTableParams = new ngTableParams({
                    page: 1,
                    count: 10,
                    sorting: {'requestHeader.statusDate': 'desc', 'requestHeader.requestDate': 'desc', id: 'asc'}
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

                        return batchService.getBatches(params.page() - 1, params.count(), params.filter().search, sortFields, sortDirs).then(function (requests) {
                            params.total(requests.total);
                            if (requests.items && requests.items.length > 0) {
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

            vm.tableParams = batchTableParams;
        }
    ]);