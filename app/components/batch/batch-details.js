'use strict';

angular
    .module('conceptRequestServiceApp.batch')
    .controller('BatchDetailsCtrl', [
        '$rootScope',
        '$filter',
        '$routeParams',
        'ngTableParams',
        'batchService',
        'requestService',
        'notificationService',
        'accountService',
        'CRS_ROLE',
        function ($rootScope, $filter, $routeParams, ngTableParams, batchService, requestService, notificationService, accountService, CRS_ROLE) {
            var vm = this;

            var initView = function () {
                $rootScope.pageTitles = ['Batch Details', $routeParams.batchId];
                loadBatchRequests();
            };

            var loadBatchRequests = function () {

                vm.requests = null;
                batchService.getBatch($routeParams.batchId).then(function (requests) {
                    vm.requests = requests;

                    if (angular.isArray(vm.requests) && vm.requests.length > 0) {
                        vm.batchHeader = vm.requests[0].requestHeader;
                        vm.batchHeader.batchRequest = vm.requests[0].batchRequest;
                    }

                    if (vm.tableParams) {
                        vm.tableParams.reload();
                    }
                });
                /*requestService.getRequests().then(function (requests) {
                    vm.requests = requests;
                    if (vm.tableParams) {
                        vm.tableParams.reload();
                    }
                });*/
            };

            var requestTableParams = new ngTableParams({
                    page: 1,
                    count: 10,
                    sorting: {'requestHeader.requestDate': 'desc', batchId: 'asc', id: 'asc'}
                },
                {
                    filterDelay: 50,
                    total: vm.requests ? vm.requests.length : 0, // length of data
                    getData: function (params) {

                        if (!vm.requests || vm.requests.length == 0) {
                            return [];
                        } else {

                            var searchStr = params.filter().search;
                            var mydata = [];

                            if (searchStr) {
                                mydata = vm.requests.filter(function (item) {
                                    return (item.batchRequest + '').indexOf(searchStr.toLowerCase()) > -1 ||
                                        (item.jiraTicketId || '').toLowerCase().indexOf(searchStr.toLowerCase()) > -1 ||
                                        (item.reasonForChange || '').toLowerCase().indexOf(searchStr.toLowerCase()) > -1;
                                });
                            } else {
                                mydata = vm.requests;
                            }

                            params.total(mydata.length);
                            mydata = params.sorting() ? $filter('orderBy')(mydata, params.orderBy()) : mydata;

                            return mydata.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        }

                    }
                }
            );


            vm.tableParams = requestTableParams;
            vm.requests = null;
            vm.batchHeader = {};

            initView();
        }
    ]);