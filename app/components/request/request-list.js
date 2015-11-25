'use strict';

angular
    .module('conceptRequestServiceApp.request')
    .controller('RequestListCtrl', [
        '$filter',
        'ngTableParams',
        'requestService',
        'notificationService',
        'accountService',
        'CRS_ROLE',
        function ($filter, ngTableParams, requestService, notificationService, accountService, CRS_ROLE) {
            var vm = this;

            var initView = function () {
                loadRequests();

                // check admin role
                accountService.checkRoles([CRS_ROLE.ADMINISTRATOR, CRS_ROLE.MANAGER]).then(function (rs) {
                    vm.isAdmin = rs;

                    if (rs === true) {
                        vm.submittedTableParams = new ngTableParams({
                                page: 1,
                                count: 10,
                                sorting: {'requestHeader.requestDate': 'desc', batchId: 'asc', id: 'asc'}
                            },
                            {
                                filterDelay: 50,
                                total: vm.submittedRequests ? vm.submittedRequests.length : 0, // length of data
                                getData: function (params) {

                                    if (!vm.submittedRequests || vm.submittedRequests.length == 0) {
                                        return [];
                                    } else {

                                        var searchStr = params.filter().search;
                                        var mydata = [];

                                        if (searchStr) {
                                            mydata = vm.submittedRequests.filter(function (item) {
                                                return (item.batchRequest + '').indexOf(searchStr.toLowerCase()) > -1 ||
                                                    (item.jiraTicketId || '').toLowerCase().indexOf(searchStr.toLowerCase()) > -1 ||
                                                    (item.reasonForChange || '').toLowerCase().indexOf(searchStr.toLowerCase()) > -1;
                                            });
                                        } else {
                                            mydata = vm.submittedRequests;
                                        }

                                        params.total(mydata.length);
                                        mydata = params.sorting() ? $filter('orderBy')(mydata, params.orderBy()) : mydata;

                                        return mydata.slice((params.page() - 1) * params.count(), params.page() * params.count());
                                    }

                                }
                            }
                        );

                        loadSubmittedRequests();
                    }
                });
            };

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

            var loadSubmittedRequests = function () {
                notificationService.sendMessage('crs.request.message.listLoading', 0);

                vm.requests = null;
                requestService.getSubmittedRequests().then(function (requests) {
                    vm.submittedRequests = requests;
                    notificationService.sendMessage('crs.request.message.listLoaded', 5000);
                    if (vm.submittedTableParams) {
                        vm.submittedTableParams.reload();
                    }
                });
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

            var editRequest = function (requestId) {

            };

            vm.tableParams = requestTableParams;
            vm.requests = null;
            vm.submittedRequests = null;
            vm.isAdmin = false;
            vm.editRequest = editRequest;

            initView();
        }
    ]);