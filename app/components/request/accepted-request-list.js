/*jshint newcap:false*/
'use strict';

angular
    .module('conceptRequestServiceApp.request')
    .controller('AcceptedRequestListCtrl', [
        '$filter',
        '$sce',
        '$uibModal',
        'NgTableParams',
        'requestService',
        'notificationService',
        'accountService',
        'scaService',
        'crsJiraService',
        'jiraService',
		'utilsService',
        '$scope',
        function($filter, $sce, $uibModal, NgTableParams, requestService, notificationService, accountService, scaService, crsJiraService, jiraService, utilsService, $scope) {
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
                        placeholder: "Filter summaries..."
                    }
                },
                requestId: {
                    requestId: {
                        id: "number",
                        placeholder: "Ids..."
                    }
                },
                ogirinatorId: {
                    ogirinatorId: {
                        id: "text",
                        placeholder: "Created By.."
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

            var initView = function() {
                vm.selectedRequests = { checked: false, items: {}, requests: {} };

                // check admin role
                accountService.checkUserPermission().then(function(rs) {
                    vm.isAdmin = (rs.isAdmin === true);
                    vm.isViewer = (rs.isViewer === true);
                });
				
				vm.requestStatus.sort(function(a, b) {
						return utilsService.compareStrings(a.title, b.title);
				});
				vm.requestTypes.sort(function(a, b) {
						return utilsService.compareStrings(a.title, b.title);
				});
				
                // load projects
                loadProjects();

                // load authors
                loadAuthors();

                //load staffs
                loadStaff();

                vm.requestTableParams = requestTableParams;
                var acceptedRequests;
                if(!isDateRangeFilteredFirstTime ){
                    //get filter values
                    acceptedRequests = requestService.getAcceptedFilterValues();
                    if(acceptedRequests !== undefined){
                        changeAcceptedFilter('search', acceptedRequests.search);
                        changeAcceptedFilter('requestType', acceptedRequests.requestType);
                        changeAcceptedFilter('batchRequest', acceptedRequests.batchRequest);
                        changeAcceptedFilter('fsn', acceptedRequests.concept);
                        changeAcceptedFilter('jiraTicketId', acceptedRequests.jiraTicketId);
                        changeAcceptedFilter('topic', acceptedRequests.topic);
                        changeAcceptedFilter('manager', acceptedRequests.manager);
                        changeAcceptedFilter('status', acceptedRequests.status);
                        changeAcceptedFilter('author', acceptedRequests.ogirinatorId);
                        changeAcceptedFilter('requestId', acceptedRequests.requestId);
                        changeAcceptedFilter('project', acceptedRequests.assignedProject);
                        changeAcceptedFilter('assignee', acceptedRequests.assignee);
                        changeAcceptedFilter('requestDate', {
                            startDate: acceptedRequests.requestDateFrom,
                            endDate: acceptedRequests.requestDateTo
                        });

                        if(acceptedRequests.requestDateFrom !== 0 && acceptedRequests.requestDateTo !== 0){
                            vm.daterange = {
                                startDate: new Date(acceptedRequests.requestDateFrom),
                                endDate: new Date(acceptedRequests.requestDateTo)
                            };
                        }
                    }
                }
            };
                        
            var loadProjects = function() {
                vm.loadingProjects = true;
                scaService.getProjects().then(function(response) {
					response.sort(function(a, b) {
						return utilsService.compareStrings(a.title, b.title);
					});
                    vm.projects = response;
                    for(var i in vm.projects){
                        vm.projects[i].id = vm.projects[i].key;
                    }
                }).finally(function() {
                    vm.loadingProjects = false;
                });
            };

            var loadAuthors = function() {
                notificationService.sendMessage('crs.request.message.listLoading');
                var jiraConfig = jiraService.getJiraConfig();
                var groupName = jiraConfig['author-group'];
                vm.loadingAuthors = true;
                return crsJiraService.getAuthorUsers(0, 50, true, [], groupName).then(function(users) {
                    notificationService.sendMessage('crs.request.message.listLoaded', 5000);
                    vm.authors = users;
                    for(var i in vm.authors){
                        vm.authors[i].title = vm.authors[i].displayName;
                        vm.authors[i].id = vm.authors[i].key;
                    }
                    return users;
                }).finally(function() {
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

            var getAuthorName = function(authorKey) {
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

            var getStaffName = function(staffKey) {
                if (!vm.staffs || vm.staffs.length === 0) {
                    return staffKey;
                } else {
                    for (var i = 0; i < vm.staffs.length; i++) {
                        if (vm.staffs[i].key === staffKey) {
                            //return vm.authors[i].displayName;
                            return $sce.trustAsHtml([
                                // '<img style="padding-bottom:2px" src="' + vm.staffs[i].avatarUrls['16x16'] + '"/>',
                                '<span style="vertical-align:middle">&nbsp;' + vm.staffs[i].displayName + '</span>'
                            ].join(''));
                        }
                    }
                }
            };

            var openAssignRequestModal = function(selectedRequestIds, defaultSummary) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'components/request/modal-assign-request.html',
                    controller: 'ModalAssignRequestCtrl as modal',
                    resolve: {
                        authors: function() {
                            return vm.authors;
                        },
                        projects: function() {
                            return vm.projects;
                        },
                        defaultSummary: function() {
                            return defaultSummary;
                        }
                    }
                });

                modalInstance.result.then(function(rs) {
                    notificationService.sendMessage('Assigning requests');
                    requestService.assignRequests(selectedRequestIds, rs.project.key, ((rs.assignee) ? rs.assignee.key : null), rs.summary).then(function() {
                        notificationService.sendMessage('Request assigned successfully', 5000);
                        vm.selectedRequests = { checked: false, items: {}, requests: {} };
                        requestTableParams.reload();
                    });
                });
            };

            var openAssignRequestToStaffModal = function(selectedRequestIds) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'components/request/modal-assign-request-to-staff.html',
                    controller: 'ModalAssignRequestToStaffCtrl as modal',
                    resolve: {
                        staffs: function() {
                            return vm.staffs;
                        }
                    }
                });

                modalInstance.result.then(function(rs) {
                    notificationService.sendMessage('Assigning requests');
                    requestService.assignRequestsToStaff(selectedRequestIds, ((rs.assignee) ? rs.assignee.key : null)).then(function() {
                        notificationService.sendMessage('Request assigned successfully', 5000);
                        vm.selectedRequests = { checked: false, items: {}, requests: {} };
                        requestTableParams.reload();
                    });
                });
            };

            var assignSelectedRequests = function() {
                if (vm.authors.length > 0 && vm.projects.length > 0) {
                    var selectedRequests = vm.selectedRequests,
                        selectedRequestIds = [],
                        defaultSummary;
                    if (selectedRequests &&
                        selectedRequests.items) {
                        angular.forEach(selectedRequests.items, function(isSelected, requestId) {
                            if (isSelected) {
                                selectedRequestIds.push(requestId);
                            }
                        });

                        for (var i in selectedRequests.requests) {
                            if (selectedRequests.requests[i].requestHeader.assignee !== null) {
                                notificationService.sendMessage("One or more requests are assigned. Let's remove them out of list and retry.", 5000);
                                return;
                            }
                        }
                        if (selectedRequestIds.length > 0) {
                            if (selectedRequestIds.length === 1 &&
                                selectedRequests.requests) {
                                defaultSummary = selectedRequests.requests[selectedRequestIds[0]].additionalFields.topic;
                            }
                            openAssignRequestModal(selectedRequestIds, defaultSummary);
                        }
                    }
                }
            };

            var assignSelectedRequestsToStaff = function() {
                if (vm.staffs.length > 0) {
                    var selectedRequests = vm.selectedRequests,
                        selectedRequestIds = [];
                    if (selectedRequests && selectedRequests.items) {
                        angular.forEach(selectedRequests.items, function(isSelected, requestId) {
                            if (isSelected) {
                                selectedRequestIds.push(requestId);
                            }
                        });

                        if (selectedRequestIds.length > 0) {
                            openAssignRequestToStaffModal(selectedRequestIds);
                        }
                    }
                }
            };

            //watch for check all checkbox
            $scope.$watch(function() {
                return vm.selectedRequests.checked;
            }, function(newVal) {
                if(vm.requests){
                    angular.forEach(vm.requests.items, function(item) {
                        if (angular.isDefined(item.id)) {
                            vm.selectedRequests.items[item.id] = newVal;
                        }
                    }); 
                }
            });

            var pushSelectedRequest = function(event, request) {
                if (event.target.checked) {
                    vm.selectedRequests.requests[request.id] = request;
                } else {
                    delete vm.selectedRequests.requests[request.id];
                }
            };

            var toggleShowUnassignedRequests = function() {
                vm.selectedRequests = { checked: false, items: {}, requests: {} };
                vm.showUnassignedRequests = !vm.showUnassignedRequests;
                vm.tableParams.reload();
            };

            var convertDateToMilliseconds = function(date){
                var milliseconds = new Date(date);
                return milliseconds.getTime();
            };

            var isDateRangeFilteredFirstTime = false;

            var buildRequestFilterValues = function(typeList, page, pageCount, search, sortFields, sortDirs, batchRequest, fsn, jiraTicketId, requestDateFrom, requestDateTo, topic, manager, status, author,
                project, assignee, requestId, requestType, showUnassignedRequests){
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
                requestList.assignedProject = project;
                requestList.assignee = assignee;
                requestList.requestId = requestId;
                requestList.requestType = requestType;
                requestList.showUnassignedOnly = showUnassignedRequests;
                requestList.search = search;
                return requestList;
            };

            function changeAcceptedFilter(field, value){
                var filter = {};
                filter[field] = value;
                angular.extend(requestTableParams.filter(), filter);
            }

            var requestTableParams = new NgTableParams({
                page: 1,
                count: 10,
                sorting: { 'requestHeader.requestDate': 'desc', batchRequest: 'asc', id: 'asc' },
                filter: {
                    requestDate: {
                        startDate: null,
                        endDate: null
                    }
                }
                
            }, {
                filterDelay: 700,
                getData: function(params) {
                    var sortingObj = params.sorting();
                    var sortFields = [],
                        sortDirs = [];
                    var acceptedRequests;
                    var filterValues;

                    if (sortingObj) {
                        angular.forEach(sortingObj, function(dir, field) {
                            sortFields.push(field);
                            sortDirs.push(dir);
                        });
                    }
                    
                    filterValues = buildRequestFilterValues(
                        'ACCEPTED',
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
                        params.filter().ogirinatorId,
                        params.filter().project,
                        params.filter().assignee,
                        params.filter().requestId,
                        params.filter().requestType,
                        vm.showUnassignedRequests
                    );

                    if(acceptedRequests === undefined){
                            acceptedRequests = filterValues;
                        }

                    //set filter values
                    requestService.setAcceptedFilterValues(filterValues);

                    return requestService.getRequests(acceptedRequests).then(function(requests) {
                        isDateRangeFilteredFirstTime = true;
                        params.total(requests.total);
                        vm.requests = requests;
                        if (requests.items && requests.items.length > 0) {
                            return requests.items;
                        } else {
                            return [];
                        }
                    }, function() {
                        return [];
                    });
                }
            });

            vm.onDateRangeChange = function(action){
                if(action){
                    vm.daterange = {
                        startDate: null,
                        endDate: null
                    };
                }
                requestTableParams.reload();
                requestTableParams.filter().requestDate = vm.daterange;
            };

            vm.tableParams = requestTableParams;
            vm.assignSelectedRequests = assignSelectedRequests;
            vm.assignSelectedRequestsToStaff = assignSelectedRequestsToStaff;
            vm.pushSelectedRequest = pushSelectedRequest;
            vm.getAuthorName = getAuthorName;
            vm.getStaffName = getStaffName;
            vm.toggleShowUnassignedRequests = toggleShowUnassignedRequests;
            vm.isAdmin = false;
            vm.isViewer = false;
            vm.loadingProjects = true;
            vm.loadingAuthors = true;
            vm.showUnassignedRequests = false;
            vm.projects = [];
            vm.authors = [];
            vm.staffs = [];
            vm.showFilter = false;
            vm.daterange = {
                startDate: null,
                endDate: null
            };
            vm.options = {
              format: 'YYYY-MM-DD',
              showDropdowns: true,
              type: 'moment'
            };

            initView();
        }
    ]);
