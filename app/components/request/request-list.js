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
        'REQUEST_STATUS',
        function ($filter, ngTableParams, requestService, notificationService, accountService, CRS_ROLE, REQUEST_STATUS) {
            var vm = this;

            var initView = function () {
                vm.selectedRequests = {checked: false, items: {}};
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
                                                    (item.fsn || '').toLowerCase().indexOf(searchStr.toLowerCase()) > -1 ||
                                                    (item.additionalFields.topic || '').toLowerCase().indexOf(searchStr.toLowerCase()) > -1;
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

            var removeSelectedRequests = function () {
                var selectedRequests = vm.selectedRequests,
                    removingRequestIds = [];
                if (selectedRequests &&
                    selectedRequests.items) {
                    angular.forEach(selectedRequests.items, function (isSelected, requestId) {
                        if (isSelected) {
                            for (var i = 0; i < vm.requests.length; i++) {
                                if (vm.requests[i].id + '' === requestId &&
                                    vm.requests[i].requestHeader.status === REQUEST_STATUS.DRAFT.value) {
                                    removingRequestIds.push(requestId);
                                    break;
                                }
                            }
                        }
                    });

                    if (removingRequestIds.length > 0) {
                        if (window.confirm('Are you sure you want to remove ' + removingRequestIds.length +' Draft requests?')) {
                            requestService.removeRequests(removingRequestIds).then(function () {
                                loadRequests();
                            }, function (error) {
                                notificationService.sendMessage('crs.request.message.requestRemoved', 5000);
                            });
                        }
                    } else {
                        window.alert('Please select at least a Draft request.');
                    }
                }
            };

            var requestTableParams = new ngTableParams({
                    page: 1,
                    count: 10,
                    sorting: {'requestHeader.requestDate': 'desc', batchRequest: 'asc', id: 'asc'}
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
                                        (item.fsn || '').toLowerCase().indexOf(searchStr.toLowerCase()) > -1 ||
                                        (item.additionalFields.topic || '').toLowerCase().indexOf(searchStr.toLowerCase()) > -1;
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
/*
            var editRequest = function (requestId) {

            };*/

            vm.tableParams = requestTableParams;
            vm.requests = null;
            vm.submittedRequests = null;
            vm.isAdmin = false;
            //vm.editRequest = editRequest;
            vm.removeSelectedRequests = removeSelectedRequests;

            initView();
        }
    ]);