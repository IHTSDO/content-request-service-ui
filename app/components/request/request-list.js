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
        '$routeParams',
        function ($filter, $sce, crsJiraService, NgTableParams, requestService, notificationService, accountService, jiraService, $routeParams) {
            var vm = this;

            vm.filterRequests = {
                batchRequest: {
                    batchRequest: {
                        id: "number",
                        placeholder: "Ids..."
                    }
                },    
                fsn: {
                    fsn: {
                        id: "text",
                        placeholder: "Concepts..."
                    }
                },
                jiraTicketId: {
                    jiraTicketId: {
                        id: "text",
                        placeholder: "Ids..."
                    }
                },
                topic: {
                    topic: {
                        id: "text",
                        placeholder: "Topics..."
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
                        placeholder: "Summaries..."
                    }
                },
                requestId: {
                    requestId: {
                        id: "number",
                        placeholder: "Ids..."
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

                accountService.getAccountInfo().then(function (accountDetails) {
                    vm.assignee = accountDetails.login;                   
                });

                // check admin role
                accountService.checkUserPermission().then(function (rs) {
                    vm.isAdmin = (rs.isAdmin === true);
                    vm.isViewer = (rs.isViewer === true);

                    if (!vm.isViewer) {
                        vm.tableParams = requestTableParams;
                    }

                    vm.submittedTableParams = submittedTableParams;
                    var subbmitedRequests;
                    if(!isDateRangeFilteredFirstTime ){
                        //get filter values
                        subbmitedRequests = requestService.getSubmittedFilterValues();
                        if(subbmitedRequests !== undefined){
                            changeSubmittedFilter('search', subbmitedRequests.search);
                            changeSubmittedFilter('requestType', subbmitedRequests.requestType);
                            changeSubmittedFilter('batchRequest', subbmitedRequests.batchRequest);
                            changeSubmittedFilter('fsn', subbmitedRequests.concept);
                            changeSubmittedFilter('jiraTicketId', subbmitedRequests.jiraTicketId);
                            changeSubmittedFilter('topic', subbmitedRequests.topic);
                            changeSubmittedFilter('manager', subbmitedRequests.manager);
                            changeSubmittedFilter('status', subbmitedRequests.status);
                            changeSubmittedFilter('author', subbmitedRequests.ogirinatorId);
                            changeSubmittedFilter('requestId', subbmitedRequests.requestId);
                            changeSubmittedFilter('requestDate', {
                                startDate: subbmitedRequests.requestDateFrom,
                                endDate: subbmitedRequests.requestDateTo
                            });
                            if(subbmitedRequests.requestDateFrom !== 0 && subbmitedRequests.requestDateTo !== 0){
                                vm.daterangeSQ = {
                                    startDate: new Date(subbmitedRequests.requestDateFrom),
                                    endDate: new Date(subbmitedRequests.requestDateTo)
                                };
                            }
                        }
                    }

                    vm.requestTableParams = requestTableParams;
                    var myRequests;
                    if(!isDateRangeFilteredFirstTime ){
                        //get filter values
                        myRequests = requestService.getFilterValues();
                        if(myRequests !== undefined){
                            changeMyRequestFilter('search', myRequests.search);
                            changeMyRequestFilter('requestType', myRequests.requestType);
                            changeMyRequestFilter('batchRequest', myRequests.batchRequest);
                            changeMyRequestFilter('fsn', myRequests.concept);
                            changeMyRequestFilter('jiraTicketId', myRequests.jiraTicketId);
                            changeMyRequestFilter('topic', myRequests.topic);
                            changeMyRequestFilter('manager', myRequests.manager);
                            changeMyRequestFilter('status', myRequests.status);
                            changeMyRequestFilter('author', myRequests.ogirinatorId);
                            changeMyRequestFilter('requestId', myRequests.requestId);
                            changeMyRequestFilter('requestDate', {
                                startDate: myRequests.requestDateFrom,
                                endDate: myRequests.requestDateTo
                            });
                            if(myRequests.requestDateFrom !== 0 && myRequests.requestDateTo !== 0){
                                vm.daterange = {
                                    startDate: new Date(myRequests.requestDateFrom),
                                    endDate: new Date(myRequests.requestDateTo)
                                };
                            }
                        }
                    }

                    vm.assignedRequestTableParams = assignedRequestTableParams;
                    var myAssignedRequests;
                    if(!isDateRangeFilteredFirstTime ){
                        //get filter values
                        myAssignedRequests = requestService.getAssignedFilterValues();
                        if(myAssignedRequests !== undefined){
                            changeAssignedFilter('search', myAssignedRequests.search);
                            changeAssignedFilter('requestType', myAssignedRequests.requestType);
                            changeAssignedFilter('batchRequest', myAssignedRequests.batchRequest);
                            changeAssignedFilter('fsn', myAssignedRequests.concept);
                            changeAssignedFilter('jiraTicketId', myAssignedRequests.jiraTicketId);
                            changeAssignedFilter('topic', myAssignedRequests.topic);
                            changeAssignedFilter('manager', myAssignedRequests.manager);
                            changeAssignedFilter('status', myAssignedRequests.status);
                            changeAssignedFilter('author', myAssignedRequests.ogirinatorId);
                            changeAssignedFilter('requestId', myAssignedRequests.requestId);
                            changeAssignedFilter('requestDate', {
                                startDate: myAssignedRequests.requestDateFrom,
                                endDate: myAssignedRequests.requestDateTo
                            });
                            if(myAssignedRequests.requestDateFrom !== 0 && myAssignedRequests.requestDateTo !== 0){
                                vm.daterangeMAR = {
                                    startDate: new Date(myAssignedRequests.requestDateFrom),
                                    endDate: new Date(myAssignedRequests.requestDateTo)
                                };
                            }
                        }
                    }
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
                                    // '<img src="' + vm.authors[i].avatarUrls['16x16'] + '"/>',
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
                                    // '<img src="' + vm.staffs[i].avatarUrls['16x16'] + '"/>',
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
                requestList.requestId = requestId;
                requestList.requestType = requestType;
                requestList.search = search;
                return requestList;

            };

            vm.daterange = {
                startDate: 'aa',
                endDate: 'aa'
            };
            var isDateRangeFilteredFirstTime = false;

            var requestTableParams = new NgTableParams({
                    page: 1,
                    count: 10,
                    sorting: {'requestHeader.requestDate': 'desc', batchRequest: 'asc', id: 'asc'},
                    filter: {
                        status: $routeParams.status,
                        manager: $routeParams.assignee,
                        requestDate: {
                            startDate: null,
                            endDate: null
                        }
                    }
                },
                {
                    filterDelay: 700,
                    getData: function (params) {
                        var sortingObj = params.sorting();
                        var sortFields = [], sortDirs = [];
                        var myRequests;
                        var filterValues;

                        if (sortingObj) {
                            angular.forEach(sortingObj, function (dir, field) {
                                sortFields.push(field);
                                sortDirs.push(dir);
                            });
                        }
                        notificationService.sendMessage('crs.request.message.listLoading');
                        
                        filterValues = buildRequestList(
                            'REQUEST',
                            params.page() - 1, 
                            params.count(), 
                            params.filter().search, 
                            sortFields, 
                            sortDirs, 
                            params.filter().batchRequest, 
                            params.filter().fsn, 
                            params.filter().jiraTicketId,
                            params.filter().requestDate.startDate,
                            params.filter().requestDate.endDate,
                            params.filter().topic,
                            // params.filter().summary,
                            params.filter().manager,
                            params.filter().status,
                            params.filter().author,
                            params.filter().requestId,
                            params.filter().requestType
                        );

                        if(myRequests === undefined){
                            myRequests = filterValues;
                        }

                        //set filter values
                        requestService.setFilterValues(filterValues);

                        return requestService.getRequests(myRequests).then(function (requests) {
                            isDateRangeFilteredFirstTime = true;
                            notificationService.sendMessage('crs.request.message.listLoaded', 5000);
                            params.total(requests.total);
                            vm.requests = requests;
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

            var assignedRequestTableParams = new NgTableParams({
                    page: 1,
                    count: 10,
                    sorting: {'requestHeader.requestDate': 'desc', batchRequest: 'asc', id: 'asc'},
                    filter: {
                        status: $routeParams.status,
                        manager: $routeParams.assignee,
                        requestDate: {
                            startDate: null,
                            endDate: null
                        }
                    }
                },
                {
                    filterDelay: 700,
                    getData: function (params) {
                        var sortingObj = params.sorting();
                        var sortFields = [], sortDirs = [];
                        var myAssignedRequests;
                        var filterValues;

                        if (sortingObj) {
                            angular.forEach(sortingObj, function (dir, field) {
                                sortFields.push(field);
                                sortDirs.push(dir);
                            });
                        }
                        notificationService.sendMessage('crs.request.message.listLoading');
                        
                        filterValues = buildRequestList(
                            'REQUEST',
                            params.page() - 1, 
                            params.count(), 
                            params.filter().search, 
                            sortFields, 
                            sortDirs, 
                            params.filter().batchRequest, 
                            params.filter().fsn, 
                            params.filter().jiraTicketId,
                            params.filter().requestDate.startDate,
                            params.filter().requestDate.endDate,
                            params.filter().topic,
                            // params.filter().summary,
                            vm.assignee,
                            params.filter().status,
                            params.filter().author,
                            params.filter().requestId,
                            params.filter().requestType
                        );

                        if(myAssignedRequests === undefined){
                            myAssignedRequests = filterValues;
                        }

                        //set filter values
                        requestService.setAssignedFilterValues(filterValues);
                        console.log(myAssignedRequests);
                        return requestService.getRequests(myAssignedRequests).then(function (requests) {
                            isDateRangeFilteredFirstTime = true;
                            notificationService.sendMessage('crs.request.message.listLoaded', 5000);
                            params.total(requests.total);
                            vm.requests = requests;
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
                    sorting: {'requestHeader.requestDate': 'desc', batchRequest: 'asc', id: 'asc'},
                    filter: {
                        status: $routeParams.status,
                        manager: $routeParams.assignee,
                        requestDate: {
                            startDate: null,
                            endDate: null
                        }
                    }
                },
                
                {
                    filterDelay: 700,
                    getData: function (params) {
                        var sortingObj = params.sorting();
                        var sortFields = [], sortDirs = [];
                        var filterValues;
                        var subbmitedRequests;

                        if (sortingObj) {
                            angular.forEach(sortingObj, function (dir, field) {
                                sortFields.push(field);
                                sortDirs.push(dir);
                            });
                        }

                        filterValues = buildRequestList(
                            'SUBMITTED',
                            params.page() - 1, 
                            params.count(), 
                            params.filter().search, 
                            sortFields, 
                            sortDirs, 
                            params.filter().batchRequest, 
                            params.filter().fsn, 
                            params.filter().jiraTicketId,
                            params.filter().requestDate.startDate,
                            params.filter().requestDate.endDate,
                            params.filter().topic,
                            // params.filter().summary,
                            params.filter().manager,
                            params.filter().status,
                            params.filter().author,
                            params.filter().requestId,
                            params.filter().requestType
                        );
                        if(subbmitedRequests === undefined){
                            subbmitedRequests = filterValues;
                        }
                        //set filter values
                        requestService.setSubmittedFilterValues(filterValues);
                        
                        return requestService.getRequests(subbmitedRequests).then(function (requests) {
                            isDateRangeFilteredFirstTime = true;
                            params.total(requests.total);
                            vm.requests = requests;
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

            function changeAssignedFilter(field, value){
                var filter = {};
                filter[field] = value;
                angular.extend(assignedRequestTableParams.filter(), filter);
            }

            function changeSubmittedFilter(field, value){
                var filter = {};
                filter[field] = value;
                angular.extend(submittedTableParams.filter(), filter);
            }

            function changeMyRequestFilter(field, value){
                var filter = {};
                filter[field] = value;
                angular.extend(requestTableParams.filter(), filter);
            }

            var onDateRangeChangeMAR = function(action){
                if(action){
                    vm.daterangeMAR = {
                        startDate: null,
                        endDate: null
                    };
                }
                assignedRequestTableParams.reload();
                assignedRequestTableParams.filter().requestDate = vm.daterangeMAR;
            };

            var onDateRangeChangeSQ = function(action){
                if(action){
                    vm.daterangeSQ = {
                        startDate: null,
                        endDate: null
                    };
                }
                submittedTableParams.reload();
                submittedTableParams.filter().requestDate = vm.daterangeSQ;
            };

            var onDateRangeChange = function(action){
                if(action){
                    vm.daterange = {
                        startDate: null,
                        endDate: null
                    };
                }
                requestTableParams.reload();
                requestTableParams.filter().requestDate = vm.daterange;
            };

            vm.showFilter = false;
            vm.isAdmin = false;
            vm.isViewer = false;
            vm.loadingAuthors = true;
            vm.removeSelectedRequests = removeSelectedRequests;
            vm.getAuthorName = getAuthorName;
            vm.getStaffName = getStaffName;
            vm.onDateRangeChange = onDateRangeChange;
            vm.onDateRangeChangeSQ = onDateRangeChangeSQ;
            vm.onDateRangeChangeMAR = onDateRangeChangeMAR;
            vm.daterange = {
                startDate: null,
                endDate: null
            };
            vm.daterangeSQ = {
                startDate: null,
                endDate: null
            };
            vm.daterangeMAR = {
                startDate: null,
                endDate: null
            };
            vm.options = {
              format: 'DD/MM',
              showDropdowns: true,
              type: 'moment'
            };
            
            initView();
        }
    ]);