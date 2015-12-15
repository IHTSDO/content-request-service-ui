'use strict';

angular
    .module('conceptRequestServiceApp.request')
    .controller('AcceptedRequestListCtrl', [
        '$filter',
        '$uibModal',
        'ngTableParams',
        'requestService',
        'notificationService',
        'accountService',
        'CRS_ROLE',
        'REQUEST_STATUS',
        function ($filter, $uibModal, ngTableParams, requestService, notificationService, accountService, CRS_ROLE, REQUEST_STATUS) {
            var vm = this;

            var initView = function () {
                vm.selectedRequests = {checked: false, items: {}};

                // check admin role
                accountService.checkRoles([CRS_ROLE.ADMINISTRATOR, CRS_ROLE.MANAGER]).then(function (rs) {
                    vm.isAdmin = rs;
                });
            };

            var openAssignRequestModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'components/request/modal-assign-request.html',
                    controller: 'ModalAssignRequestCtrl as modal'
                });

                modalInstance.result.then(function (rs) {
                    console.log(rs);
                });
            };

            var assignSelectedRequests = function () {
                var selectedRequests = vm.selectedRequests,
                    selectedRequestIds = [];
                if (selectedRequests &&
                    selectedRequests.items) {
                    angular.forEach(selectedRequests.items, function (isSelected, requestId) {
                        if (isSelected) {
                            selectedRequestIds.push(requestId);
                        }
                    });

                    if (selectedRequestIds.length > 0) {
                        openAssignRequestModal();
                    }
                }
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

                        return requestService.getAcceptedRequests(params.page() - 1, params.count(), params.filter().search, sortFields, sortDirs).then(function (requests) {
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

            vm.tableParams = requestTableParams;
            vm.assignSelectedRequests = assignSelectedRequests;
            vm.isAdmin = false;

            initView();
        }
    ]);