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

            var loadBatches = function () {
                notificationService.sendMessage('crs.batch.message.listLoading', 0);

                vm.batches = null;
                batchService.getBatches().then(function (batches) {
                    vm.batches = batches;
                    notificationService.sendMessage('crs.batch.message.listLoaded', 5000);
                    if (vm.tableParams) {
                        vm.tableParams.reload();
                    }
                });
            };

            var batchTableParams = new ngTableParams({
                    page: 1,
                    count: 10,
                    sorting: {modifiedDate: 'desc', uploadedDate: 'desc', id: 'asc'}
                },
                {
                    filterDelay: 50,
                    total: vm.batches ? vm.batches.length : 0, // length of data
                    getData: function (params) {

                        if (!vm.batches || vm.batches.length == 0) {
                            return [];
                        } else {

                            var searchStr = params.filter().search;
                            var mydata = [];

                            if (searchStr) {
                                mydata = vm.batches.filter(function (item) {
                                    return (item.id + '').indexOf(searchStr.toLowerCase()) > -1
                                        || item.fsn.toLowerCase().indexOf(searchStr.toLowerCase()) > -1;
                                });
                            } else {
                                mydata = vm.batches;
                            }

                            params.total(mydata.length);
                            mydata = params.sorting() ? $filter('orderBy')(mydata, params.orderBy()) : mydata;

                            return mydata.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        }

                    }
                }
            );

            vm.tableParams = batchTableParams;
            vm.batches = null;

            loadBatches();
        }
    ]);