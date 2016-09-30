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
        'BULK_ACTION_STATUS',
        'BULK_ACTION',
        function($filter, $sce, $uibModal, NgTableParams, requestService, notificationService, accountService, scaService, crsJiraService, jiraService, utilsService, $scope, BULK_ACTION_STATUS, BULK_ACTION) {
            var vm = this;
            var maxSize;

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
                        placeholder: "Surname.."
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
                // {
                //     id: "APPROVED",
                //     title: "Approved"
                // },
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
                    title: "Change Inactivate Concept"
                },
                {
                    id: "CHANGE_DESCRIPTION",
                    title: "Change Description"
                },
                {
                    id: "RETIRE_DESCRIPTION",
                    title: "Inactivate Description"
                },
                {
                    id: "RETIRE_RELATIONSHIP",
                    title: "Inactivate Relationship"
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

            var bulkAction = {
                submit: 'SUBMIT',
                accept: 'ACCEPT',
                assignToStaff: 'ASSIGN_MANAGER',
                assignToAuthor: 'ACCEPT_ASSIGN_AUTHOR',
                assignAuthor: 'ASSIGN_AUTHOR',
                unassignAuthor: 'UNASSIGN_AUTHOR',
                addNote: 'ADD_NOTE'
            };

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

                //load max size
                getMaxSize();

                //load requestors
                loadRequestors();

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

            var getMaxSize = function(){
                requestService.getMaxSize().then(function(result){
                    maxSize = result.maxSize;
                }, function(error){
                    notificationService.sendMessage(error.message, 5000);
                });
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

            var loadRequestors = function() {
                var jiraConfig = jiraService.getJiraConfig();
                var groupName = jiraConfig['requestor-group'];
                vm.loadingAuthors = true;
                return crsJiraService.getAuthorUsers(0, 50, true, [], groupName).then(function(users) {
                    vm.requestors = users;
                    for(var i in vm.requestors){
                        vm.requestors[i].title = vm.requestors[i].displayName;
                        vm.requestors[i].id = vm.requestors[i].key;
                    }
                    return users;
                }).finally(function() {
                    vm.loadingAuthors = false;
                });
            };

            var getAuthorName = function(authorKey) {
                var usersList = [];
                for(var x in vm.authors){
                    usersList.push(vm.authors[x]);
                }
                for(var y in vm.staffs){
                    usersList.push(vm.staffs[y]);
                }
                for(var z in vm.requestors){
                    usersList.push(vm.requestors[z]);
                }
                if (!usersList || usersList.length === 0) {
                    return authorKey;
                } else {
                    for (var i = 0; i < usersList.length; i++) {
                        if (usersList[i].key === authorKey) {
                            //return vm.authors[i].displayName;
                            return $sce.trustAsHtml([
                                // '<img src="' + vm.authors[i].avatarUrls['16x16'] + '"/>',
                                '<span style="vertical-align:middle">&nbsp;' + usersList[i].displayName + '</span>'
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

            var bulkActionRespondingModal = function(bulkActionId, actionTypeLangKey){
                var modalInstance = $uibModal.open({
                    templateUrl: 'components/request/bulk-action-responding-modal.html',
                    controller: 'BulkActionRespondingModalCtrl as modal',
                    resolve: {
                        bulkActionId: function() {
                            return bulkActionId;
                        },
                        actionLangKey: function(){
                            return actionTypeLangKey;
                        }
                    }
                });

                modalInstance.result.then(function() {
                    vm.selectedRequests = { checked: false, items: {}, requests: {} };
                    requestTableParams.reload();
                });
            };

            var openAssignRequestToStaffModal = function(selectedRequestIds) {
                var dataList = [];
                var action = bulkAction.assignToStaff;
                var unassignedUser = {
                    displayName: 'Unassigned ',
                    id: null,
                    key: ''
                };
                dataList.push(unassignedUser);
                for(var i in vm.staffs){
                    dataList.push(vm.staffs[i]);
                }
                var modalInstance = $uibModal.open({
                    templateUrl: 'components/request/modal-assign-request-to-staff.html',
                    controller: 'ModalAssignRequestToStaffCtrl as modal',
                    resolve: {
                        staffs: function() {
                            return dataList;
                        }
                    }
                });

                modalInstance.result.then(function(rs) {
                    // notificationService.sendMessage('Processing...');
                    var data = {
                        data: {
                            manager: rs.assignee? rs.assignee.key : null
                        },
                        requestIds: selectedRequestIds
                    };
                    requestService.bulkAction(data, action).then(function (response) {
                        if(response.status === BULK_ACTION_STATUS.STATUS_IN_PROGRESS.value){
                            bulkActionRespondingModal(response.id, BULK_ACTION.ASSIGN_STAFF.langKey);
                        }
                    }, function(error){
                        notificationService.sendMessage(error.message, 5000);
                    });
                });
            };

            var assignSelectedRequests = function() {
                if (vm.authors.length > 0 && vm.projects.length > 0) {
                    var selectedRequests = vm.selectedRequests,
                        selectedRequestIds = [],
                        action = bulkAction.assignAuthor;
                    if (selectedRequests && selectedRequests.items) {
                        angular.forEach(selectedRequests.items, function(isSelected, requestId) {
                            if (isSelected) {
                                selectedRequestIds.push(requestId);
                            }
                        });

                        if (selectedRequestIds.length > 0) {
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
                                    defaultSummary: function(){
                                        return '';
                                    }
                                }
                            });

                            modalInstance.result.then(function(rs) {
                                // notificationService.sendMessage('Processing...');
                                var data = {
                                    data: {
                                        assignee: rs.assignee? rs.assignee.key : null,
                                        project: rs.project.key,
                                        summary: rs.summary
                                    },
                                    requestIds: selectedRequestIds
                                };
                                requestService.bulkAction(data, action).then(function (response) {
                                    if(response.status === BULK_ACTION_STATUS.STATUS_IN_PROGRESS.value){
                                        bulkActionRespondingModal(response.id, BULK_ACTION.ASSIGN_AUTHOR.langKey);
                                    }
                                }, function(error){
                                    notificationService.sendMessage(error.message, 5000);
                                });
                            });
                        }else{
                            notificationService.sendMessage('Please select at least a request to assign.', 5000);
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

                        if(selectedRequestIds.length > maxSize){
                            notificationService.sendMessage('Cannot assign requests! The list cannot be longer than ' + maxSize + ' requests.', 5000);
                        }else if (selectedRequestIds.length > 0) {
                            openAssignRequestToStaffModal(selectedRequestIds);
                        }else {
                            notificationService.sendMessage('Please select at least a request to assign.', 5000);
                        }
                    }
                }
            };

            var addNote = function(){
                var selectedRequests = vm.selectedRequests,
                    selectedRequestIds = [];
                var action = bulkAction.addNote;
                if (selectedRequests &&
                    selectedRequests.items) {
                    angular.forEach(selectedRequests.items, function (isSelected, requestId) {
                        if (isSelected) {
                            selectedRequestIds.push(requestId);
                        }
                    });
                    if(selectedRequestIds.length > maxSize){
                        notificationService.sendMessage('Action denied! The list cannot be longer than ' + maxSize + ' requests.', 5000);
                    }else if (selectedRequestIds.length > 0) {
                        var modalInstance = $uibModal.open({
                            templateUrl: 'components/request/add-note-modal.html',
                            controller: 'AddNoteModalCtrl as modal'
                        });
                        modalInstance.result.then(function(rs) {
                            var data = {
                                data: {
                                    message: rs.message,
                                    isInternal: rs.isInternal
                                },
                                requestIds: selectedRequestIds
                            };
                            requestService.bulkAction(data, action).then(function(response) {
                                if(response.status === BULK_ACTION_STATUS.STATUS_IN_PROGRESS.value){
                                    bulkActionRespondingModal(response.id, BULK_ACTION.ADD_NOTE.langKey);
                                }
                            });
                        });
                    }else {
                        notificationService.sendMessage('Please select at least a request.', 5000);
                    }
                }
            };

            var unassignSelectedRequests = function(){
                var selectedRequests = vm.selectedRequests,
                    selectedRequestIds = [],
                    action = bulkAction.unassignAuthor;
                if (selectedRequests && selectedRequests.items) {
                    angular.forEach(selectedRequests.items, function(isSelected, requestId) {
                        if (isSelected) {
                            selectedRequestIds.push(requestId);
                        }
                    });

                    if(selectedRequestIds.length > maxSize){
                        notificationService.sendMessage('Cannot unassign requests! The list cannot be longer than ' + maxSize + ' requests.', 5000);
                    }else if (selectedRequestIds.length > 0) {
                        var data = {
                            data: {},
                            requestIds: selectedRequestIds
                        };
                        requestService.bulkAction(data, action).then(function (response) {
                            if(response.status === BULK_ACTION_STATUS.STATUS_IN_PROGRESS.value){
                                bulkActionRespondingModal(response.id, BULK_ACTION.UNASSIGN_AUTHOR.langKey);
                            }
                        }, function(error){
                            notificationService.sendMessage(error.message, 5000);
                        });
                    }else {
                        notificationService.sendMessage('Please select at least a request to unassign.', 5000);
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
                            vm.selectedRequests.requests[item.id] = item;
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
                    notificationService.sendMessage('crs.request.message.listLoading');
                    
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
                        notificationService.sendMessage('crs.request.message.listLoaded', 5000);
                        params.total(requests.total);
                        vm.requests = requests;
                        vm.selectedRequests = { checked: false, items: {}, requests: {} };
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
            vm.unassignSelectedRequests = unassignSelectedRequests;
            vm.pushSelectedRequest = pushSelectedRequest;
            vm.getAuthorName = getAuthorName;
            vm.getStaffName = getStaffName;
            vm.toggleShowUnassignedRequests = toggleShowUnassignedRequests;
            vm.addNote = addNote;
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
