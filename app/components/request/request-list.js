/*jshint newcap:false*/
'use strict';

angular
    .module('conceptRequestServiceApp.request')
    .controller('RequestListCtrl', [
        '$filter',
        '$sce',
        'crsJiraService',
        'NgTableParams',
        'requestService',
        'notificationService',
        'accountService',
        'jiraService',
        function ($filter, $sce, crsJiraService, NgTableParams, requestService, notificationService, accountService, jiraService) {
            var vm = this;

            vm.filterRequests = {
                batchRequest: {
                    batchRequest: {
                        id: "number",
                        placeholder: "Filter Ids..."
                    }
                },    
                fsn: {
                    fsn: {
                        id: "text",
                        placeholder: "Filter concepts..."
                    }
                },
                jiraTicketId: {
                    jiraTicketId: {
                        id: "text",
                        placeholder: "Filter Ids..."
                    }
                },
                topic: {
                    topic: {
                        id: "text",
                        placeholder: "Filter topics..."
                    }
                },
                manager: {
                    manager: {
                        id: "select"
                    }
                },
                status: {
                    status: {
                        id: "select"
                    }
                },
                summary: {
                    summary: {
                        id: "text",
                        placeholder: "Filter summaries..."
                    }
                },
                requestId: {
                    requestId: {
                        id: "number",
                        placeholder: "Filter Ids..."
                    }
                }
            };

            vm.requestStatus = [
                {
                    id: "DRAFT",
                    title: "Draft"
                },
                {
                    id: "NEW",
                    title: "New"
                },
                {
                    id: "ACCEPTED",
                    title: "Accepted"
                },
                {
                    id: "UNDER_AUTHORING",
                    title: "Under Authoring"
                },
                {
                    id: "REJECTED",
                    title: "Rejected"
                },
                {
                    id: "CLARIFICATION_NEEDED",
                    title: "Pending Clarification"
                },
                {
                    id: "APPEAL",
                    title: "In Appeal"
                },
                {
                    id: "ON_HOLD",
                    title: "On Hold"
                },
                {
                    id: "WITHDRAWN",
                    title: "Withdrawn"
                },
                {
                    id: "APPEAL_REJECTED",
                    title: "Appeal Rejected"
                },
                {
                    id: "APPROVED",
                    title: "Approved"
                },
                {
                    id: "RELEASED",
                    title: "Completed"
                },
                {
                    id: "FORWARDED",
                    title: "Forwarded"
                },
                {
                    id: "IN_INCEPTION_ELABORATION",
                    title: "In Inception/Elaboration"
                },
                {
                    id: "READY_FOR_RELEASE",
                    title: "Ready For Release"
                }
            ];

            vm.requestTypes = [
                {
                    id: "NEW_CONCEPT",
                    title: "New Concept"
                },
                {
                    id: "NEW_DESCRIPTION",
                    title: "New Description"
                },
                {
                    id: "NEW_RELATIONSHIP",
                    title: "New Relationship"
                },
                {
                    id: "CHANGE_RETIRE_CONCEPT",
                    title: "Change Retire Concept"
                },
                {
                    id: "CHANGE_DESCRIPTION",
                    title: "Change Description"
                },
                {
                    id: "RETIRE_DESCRIPTION",
                    title: "Retire Description"
                },
                {
                    id: "RETIRE_RELATIONSHIP",
                    title: "Retire Relationship"
                },
                {
                    id: "CHANGE_RELATIONSHIP",
                    title: "Change Relationship"
                },
                {
                    id: "OTHER",
                    title: "Other"
                },
            ];

            var initView = function () {
                vm.selectedRequests = {checked: false, items: {}};
                vm.selectedSubmittedRequests = {checked: false, items: {}};

                // check admin role
                accountService.checkUserPermission().then(function (rs) {
                    vm.isAdmin = (rs.isAdmin === true);
                    vm.isViewer = (rs.isViewer === true);

                    if (!vm.isViewer) {
                        vm.tableParams = requestTableParams;
                    }

                    vm.submittedTableParams = submittedTableParams;
                });

                // load authors
                loadAuthors();

                //load staffs
                loadStaff();
            };

            var loadAuthors = function () {
                var jiraConfig = jiraService.getJiraConfig();
                var groupName = jiraConfig['author-group'];
                vm.loadingAuthors = true;
                return crsJiraService.getAuthorUsers(0, 50, true, [], groupName).then(function (users) {
                    vm.authors = users;
                    for(var i in vm.authors){
                        vm.authors[i].title = vm.authors[i].displayName;
                        vm.authors[i].id = vm.authors[i].key;
                    }
                    return users;
                }).finally(function () {
                    vm.loadingAuthors = false;
                });
            };

            var loadStaff = function() {
                var jiraConfig = jiraService.getJiraConfig();
                var groupName = jiraConfig['staff-group'];
                vm.loadingAuthors = true;
                return crsJiraService.getAuthorUsers(0, 50, true, [], groupName).then(function(users) {
                    vm.staffs = users;
                    for(var i in vm.staffs){
                        vm.staffs[i].title = vm.staffs[i].displayName;
                        vm.staffs[i].id = vm.staffs[i].key;
                    }
                    return users;
                }).finally(function() {
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

            var getStaffName = function (staffKey) {
                if (!vm.staffs || vm.staffs.length === 0) {
                    return staffKey;
                } else {
                    for (var i = 0; i < vm.staffs.length; i++) {
                        if (vm.staffs[i].key === staffKey) {
                            //return vm.authors[i].displayName;
                            return $sce.trustAsHtml([
                                    '<img src="' + vm.staffs[i].avatarUrls['16x16'] + '"/>',
                                    '<span style="vertical-align:middle">&nbsp;' + vm.staffs[i].displayName + '</span>'
                            ].join(''));
                        }
                    }
                }
            };

            var removeSelectedRequests = function () {
                var selectedRequests = vm.selectedRequests,
                    removingRequestIds = [];
                if (selectedRequests &&
                    selectedRequests.items) {
                    angular.forEach(selectedRequests.items, function (isSelected, requestId) {
                        if (isSelected) {
                            removingRequestIds.push(requestId);
                            vm.selectedRequests.items[requestId]=false;
                        }
                    });

                    if (removingRequestIds.length > 0) {
                        if (window.confirm('Are you sure you want to remove ' + removingRequestIds.length +' requests?')) {
                            requestService.removeRequests(removingRequestIds).then(function () {
                                //notificationService.sendMessage('crs.request.message.requestRemoved', 5000);
                                window.alert('Requests have been removed successfully ! ');
                                if (vm.tableParams) {
                                    vm.tableParams.reload();
                                }
                                if (vm.submittedTableParams) {
                                    vm.submittedTableParams.reload();
                                }

                            });
                        }
                    } else {
                        window.alert('Please select at least a request to delete.');
                    }
                }
            };

            var convertDateToMilliseconds = function(date){
                var milliseconds = new Date(date);
                return milliseconds.getTime();
            };

            var buildRequestList = function(typeList, page, pageCount, search, sortFields, sortDirs, batchRequest, fsn, jiraTicketId, requestDateFrom, requestDateTo, topic, manager, status, author, requestId, requestType){
                var requestList = {};
                requestList.batchRequest = batchRequest;
                requestList.concept = fsn;
                requestList.jiraTicketId = jiraTicketId;
                requestList.offset = page;
                requestList.limit = pageCount;
                requestList.sortFields = sortFields;
                requestList.sortDirections = sortDirs;
                requestList.requestDateFrom = convertDateToMilliseconds(requestDateFrom);
                requestList.requestDateTo = convertDateToMilliseconds(requestDateTo);
                requestList.topic = topic;
                requestList.manager = manager;
                requestList.status = status;
                requestList.type = typeList;
                requestList.ogirinatorId = author;
                requestList.requestId = requestId? requestId: 0;
                requestList.requestType = requestType;
                requestList.search = search;
                return requestList;

            };

            var requestTableParams = new NgTableParams({
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
                        notificationService.sendMessage('crs.request.message.listLoading');
                        var myRequests;
                        myRequests = buildRequestList(
                            'REQUEST',
                            params.page() - 1, 
                            params.count(), 
                            params.filter().search, 
                            sortFields, 
                            sortDirs, 
                            params.filter().batchRequest, 
                            params.filter().fsn, 
                            params.filter().jiraTicketId,
                            params.filter().requestDateFrom,
                            params.filter().requestDateTo,
                            params.filter().topic,
                            // params.filter().summary,
                            params.filter().manager,
                            params.filter().status,
                            params.filter().author,
                            params.filter().requestId,
                            params.filter().requestType
                        );
                        return requestService.getRequests(myRequests).then(function (requests) {
                            notificationService.sendMessage('crs.request.message.listLoaded', 5000);
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

            var submittedTableParams = new NgTableParams({
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
                        var subbmitedRequests;
                        subbmitedRequests = buildRequestList(
                            'SUBMITTED',
                            params.page() - 1, 
                            params.count(), 
                            params.filter().search, 
                            sortFields, 
                            sortDirs, 
                            params.filter().batchRequest, 
                            params.filter().fsn, 
                            params.filter().jiraTicketId,
                            params.filter().requestDateFrom,
                            params.filter().requestDateTo,
                            params.filter().topic,
                            // params.filter().summary,
                            params.filter().manager,
                            params.filter().status,
                            params.filter().author,
                            params.filter().requestId,
                            params.filter().requestType
                        );
                        return requestService.getRequests(subbmitedRequests).then(function (requests) {
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

            vm.isAdmin = false;
            vm.isViewer = false;
            vm.loadingAuthors = true;
            vm.removeSelectedRequests = removeSelectedRequests;
            vm.getAuthorName = getAuthorName;
            vm.getStaffName = getStaffName;
            
            initView();
        }
    ]);