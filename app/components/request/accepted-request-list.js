'use strict';

angular
    .module('conceptRequestServiceApp.request')
    .controller('AcceptedRequestListCtrl', [
        '$filter',
        '$sce',
        '$uibModal',
        'ngTableParams',
        'requestService',
        'notificationService',
        'accountService',
        'scaService',
        'crsJiraService',
        'CRS_ROLE',
        function ($filter, $sce, $uibModal, ngTableParams, requestService, notificationService, accountService, scaService, crsJiraService, CRS_ROLE) {
            var vm = this;

            var initView = function () {
                vm.selectedRequests = {checked: false, items: {}, requests: {}};

                // check admin role
                accountService.checkUserPermission().then(function (rs) {
                    vm.isAdmin = (rs.isAdmin === true);
                    vm.isViewer = (rs.isViewer === true);
                });

                // load projects
                loadProjects();

                // load authors
                loadAuthors();
            };

            var loadProjects = function () {
                vm.loadingProjects = true;
                scaService.getProjects().then(function (response) {
                    vm.projects = response;
                }).finally(function () {
                    vm.loadingProjects = false;
                });
            };

            var loadAuthors = function () {
                vm.loadingAuthors = true;
                return crsJiraService.getAuthorUsers(0, 50, true, []).then(function (users) {
                    vm.authors = users;

                    return users;
                }).finally(function () {
                    vm.loadingAuthors = false;
                });
            };

            var getAuthorName = function (authorKey) {
                if (!vm.authors || vm.authors.length === 0) {
                    return authorKey;
                } else {
                    for (var i = 0; i < vm.authors.length; i++) {
                        if (vm.authors[i].key === authorKey) {
                            //return vm.authors[i].displayName;
                            return $sce.trustAsHtml([
                                '<img src="' + vm.authors[i].avatarUrls['16x16'] + '"/>',
                                '<span style="vertical-align:middle">&nbsp;' + vm.authors[i].displayName + '</span>'
                            ].join(''));
                        }
                    }
                }
            };

            var openAssignRequestModal = function (selectedRequestIds, defaultSummary) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'components/request/modal-assign-request.html',
                    controller: 'ModalAssignRequestCtrl as modal',
                    resolve: {
                        authors: function () {
                            return vm.authors
                        },
                        projects: function () {
                            return vm.projects;
                        },
                        defaultSummary: function () {
                            return defaultSummary;
                        }
                    }
                });

                modalInstance.result.then(function (rs) {
                    notificationService.sendMessage('Assigning requests');
                    requestService.assignRequests(selectedRequestIds, rs.project.key, rs.assignee.key, rs.summary).then(function () {
                        notificationService.sendMessage('Request assigned successfully', 5000);
                        vm.selectedRequests = [];
                        requestTableParams.reload();
                    });
                });
            };

            var assignSelectedRequests = function () {
                var selectedRequests = vm.selectedRequests,
                    selectedRequestIds = [],
                    defaultSummary;
                if (selectedRequests &&
                    selectedRequests.items) {
                    angular.forEach(selectedRequests.items, function (isSelected, requestId) {
                        if (isSelected) {
                            selectedRequestIds.push(requestId);
                        }
                    });

                    if (selectedRequestIds.length > 0) {
                        if (selectedRequestIds.length === 1 &&
                            selectedRequests.requests) {
                            defaultSummary = selectedRequests.requests[selectedRequestIds[0]].additionalFields.topic;
                        }
                        openAssignRequestModal(selectedRequestIds, defaultSummary);
                    }
                }
            };

            var pushSelectedRequest = function (event, request) {
                if (event.target.checked) {
                    vm.selectedRequests.requests[request.id] = request;
                } else {
                    delete vm.selectedRequests.requests[request.id];
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
            vm.pushSelectedRequest = pushSelectedRequest;
            vm.getAuthorName = getAuthorName;
            vm.isAdmin = false;
            vm.isViewer = false;
            vm.loadingProjects = true;
            vm.loadingAuthors = true;
            vm.projects = [];
            vm.authors = [];

            initView();
        }
    ]);