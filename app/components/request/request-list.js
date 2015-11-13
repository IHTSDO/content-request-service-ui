'use strict';

angular
    .module('conceptRequestServiceApp.request')
    .controller('RequestListCtrl', [
        '$filter',
        'ngTableParams',
        'requestService',
        'notificationService',
        function ($filter, ngTableParams, requestService, notificationService) {
            var vm = this;

            var loadRequests = function () {
                notificationService.sendMessage('crs.request.message.listLoading', 0);

                vm.requests = null;
                requestService.getRequests().then(function (requests) {
                    vm.requests = requests;
                    notificationService.sendMessage('crs.request.message.listLoaded', 5000);
                    if (vm.tableParams) {
                        vm.tableParams.reload();
                    }
                });
            };

            var requestTableParams = new ngTableParams({
                    page: 1,
                    count: 10,
                    sorting: {requestDate: 'desc', batchId: 'asc', requestorInternalId: 'asc'}
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
                                    return (item.requestorInternalId + '').indexOf(searchStr.toLowerCase()) > -1 ||
                                        (item.ticketId || '').toLowerCase().indexOf(searchStr.toLowerCase()) > -1;
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

            loadRequests();
        }
    ]);