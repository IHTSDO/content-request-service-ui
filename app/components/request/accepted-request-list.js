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
        '$routeParams',
        'DEFAULT_COLUMNS',
        '$timeout',
        'STATISTICS_STATUS',
        'configService',
        function ($filter, $sce, $uibModal, NgTableParams, requestService, notificationService, accountService, scaService, crsJiraService, jiraService, utilsService, $scope, BULK_ACTION_STATUS, BULK_ACTION, $routeParams, DEFAULT_COLUMNS, $timeout, STATISTICS_STATUS, configService) {
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
                trackerId: {
                    trackerId: {
                        id: "text",
                        placeholder: "Ids..."
                    }
                },
                lastStatusModifier: {
                    lastStatusModifier: {
                        id: "text",
                        placeholder: "Modifier..."
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
                },
               forwardDestinationId: {
                  forwardDestinationId: {
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
                },
                {
                    id: "IN_APPEAL_CLARIFICATION",
                    title: "In Appeal Clarification"
                },
                {
                    id: "INTERNAL_INPUT_NEEDED",
                    title: "Waiting For Internal Input"
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
                addNote: 'ADD_NOTE',
                withdraw: 'WITHDRAW',
                reject: 'REJECT',
                onHold: 'ON_HOLD',
                waitingForInternalInput: 'INTERNAL_INPUT_NEEDED',
                forward: 'FORWARD',
                clarification: 'PENDING_CLARIFICATION',
                inceptionElaboration: 'INCEPTION_ELABORATION',
                resolveWithoutContentChanges: 'RESOLVED_WITHOUT_CONTENT_CHANGES',
                awaitingAgreementCompliance: 'AWAITING_AGREEMENT_COMPLIANCE'
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
                
                vm.enabledColumns = requestService.getSavedColumns();

                if(vm.enabledColumns === null || vm.enabledColumns === undefined){
                    requestService.getUserPreferences().then(function(response){
                        if(response && (Object.keys(response).length > 1 || !response.hasOwnProperty('emailDaily') )){
                            vm.enabledColumns = response;
                        }else{
                            vm.enabledColumns = DEFAULT_COLUMNS;
                        }
                        requestService.setSavedColumns(vm.enabledColumns);
                    });
                }

                // load authors
                vm.authors = requestService.getRlAuthorsList();
                if(!vm.authors){
                    loadAuthors();
                }
                
                //load staffs
                vm.staffs = requestService.getRlStaffsList();
                if(!vm.staffs){
                    loadStaff();
                }
                
                //load requestors
                vm.requestors = requestService.getRequestorsList();
                if(!vm.requestors){
                    loadRequestors();
                }
                
                //load projects
                vm.projects = requestService.getProjectsList();
                if(!vm.projects){
                    loadProjects();
                }

                //load max size
                maxSize = requestService.getSavedMaxSize();
                if(!maxSize){
                    getMaxSize();
                }

                //save current list
                saveCurrentList();

                vm.requestTableParams = requestTableParams;
                var acceptedRequests;
                if(!isDateRangeFilteredFirstTime ){
                    //get filter values
                    acceptedRequests = requestService.getAcceptedFilterValues();
                    if (acceptedRequests !== undefined) {
                        vm.searchText = acceptedRequests.search;
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
                        changeAcceptedFilter('summary', acceptedRequests.summary);
                        changeAcceptedFilter('trackerId', acceptedRequests.trackerId);
                        changeAcceptedFilter('forwardDestinationId', acceptedRequests.forwardDestinationId);
                        changeAcceptedFilter('lastStatusModifier', acceptedRequests.lastStatusModifier);
                        changeAcceptedRequestsPageSize(acceptedRequests.limit);
                        changeAcceptedRequestsPage(acceptedRequests.offset);
                        changeAcceptedRequestsSorting(acceptedRequests.sorting);
                        changeAcceptedFilter('requestDate', {
                            startDate: acceptedRequests.requestDateFrom,
                            endDate: acceptedRequests.requestDateTo
                        });
                        changeAcceptedFilter('statusDate', {
                            startDate: acceptedRequests.statusDateFrom,
                            endDate: acceptedRequests.statusDateTo
                        });

                        if(acceptedRequests.requestDateFrom !== 0 && acceptedRequests.requestDateTo !== 0){
                            vm.daterange = {
                                startDate: new Date(acceptedRequests.requestDateFrom),
                                endDate: new Date(acceptedRequests.requestDateTo)
                            };
                        }
                        if(acceptedRequests.statusDateFrom !== 0 && acceptedRequests.statusDateTo !== 0){
                            vm.lastModifiedDateRange = {
                                startDate: new Date(acceptedRequests.statusDateFrom),
                                endDate: new Date(acceptedRequests.statusDateFrom)
                            };
                        }
                    }
                }
            };

            var saveCurrentList = function(){
                var list = $routeParams.list;
                requestService.saveCurrentList(list);
            };

            var getMaxSize = function(){
                requestService.getMaxSize().then(function(result){
                    maxSize = result.maxSize;
                    requestService.setMaxSize(maxSize);
                }, function(error){
                    notificationService.sendMessage(error.message, 5000);
                });
            };
                        
            var loadProjects = function() {
                vm.loadingProjects = true;
                requestService.getProjects().then(function(response) {
					response.sort(function(a, b) {
						return utilsService.compareStrings(a.title, b.title);
					});
                    vm.projects = response;
                    for(var i in vm.projects){
                        vm.projects[i].id = vm.projects[i].key;
                    }
                    requestService.setProjectsList(vm.projects);
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
                    requestService.setRlAuthorsList(vm.authors);
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
                    requestService.setRlStaffsList(vm.staffs);
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
                    requestService.setRequestorsList(vm.requestors);
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

            var rejectSelectedRequests = function () {
                var action = bulkAction.reject;
                var selectedRequests = vm.selectedRequests,
                    withdrawRequestIds = [];
                if (selectedRequests &&
                    selectedRequests.items) {
                    angular.forEach(selectedRequests.items, function (isSelected, requestId) {
                        if (isSelected) {
                            withdrawRequestIds.push(requestId);
                        }
                    });
                    if (withdrawRequestIds.length > 0) {
                        var modalInstance = $uibModal.open({
                            templateUrl: 'components/request/modal-withdraw-or-reject-requests.html',
                            controller: 'ModalWithdrawOrRejectRequestsCtrl as vm',
                            resolve: {
                                number: function() {
                                    return withdrawRequestIds.length;
                                },
                                langKey: function(){
                                    return BULK_ACTION.REJECT.langKey;
                                }
                            }
                        });

                        modalInstance.result.then(function(rs) {
                            var data = {
                                data: {
                                    additionalInfo:{
                                        reason: rs.reason
                                    }
                                },
                                requestIds: withdrawRequestIds
                            };
                            requestService.bulkAction(data, action).then(function(response) {
                                if(response.status === BULK_ACTION_STATUS.STATUS_IN_PROGRESS.value){
                                    bulkActionRespondingModal(response.id, BULK_ACTION.REJECT.langKey);
                                }
                            });
                        });
                    }else {
                        notificationService.sendMessage('Please select at least a request to reject.', 5000);
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

            var buildRequestFilterValues = function(typeList, page, pageCount, search, sortFields, sortDirs, batchRequest, fsn, jiraTicketId, requestDateFrom, requestDateTo, topic, summary, trackerId, manager, status, author,
                project, assignee, requestId, requestType, showUnassignedRequests, statusDateFrom, statusDateTo, lastStatusModifier, forwardDestinationId){
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
                requestList.statusDateFrom = convertDateToMilliseconds(statusDateFrom);
                requestList.statusDateTo = convertDateToMilliseconds(statusDateTo);
                requestList.summary = summary; 
                requestList.trackerId = trackerId;
                requestList.forwardDestinationId = forwardDestinationId;
                requestList.lastStatusModifier = lastStatusModifier;
                requestList.search = search;
                return requestList;
            };

            function changeAcceptedFilter(field, value){
                var filter = {};
                filter[field] = value;
                angular.extend(requestTableParams.filter(), filter);
            }

            function changeAcceptedRequestsSorting(sorting){
                requestTableParams.sorting(sorting);
            }

            function changeAcceptedRequestsPage(page){
                requestTableParams.page(page + 1);
            }

            function changeAcceptedRequestsPageSize(pageSize){
                requestTableParams.count(pageSize);
            }

            var requestTableParams = new NgTableParams({
                page: 1,
                count: 10,
                sorting: { 'requestHeader.requestDate': 'desc', batchRequest: 'desc', id: 'desc' },
                filter: {
                    requestDate: {
                        startDate: null,
                        endDate: null
                    },
                    statusDate: {
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
                        params.filter().summary,
                        params.filter().trackerId,
                        params.filter().manager,
                        params.filter().status,
                        params.filter().ogirinatorId,
                        params.filter().project,
                        params.filter().assignee,
                        params.filter().requestId,
                        params.filter().requestType,
                        vm.showUnassignedRequests, 
                        params.filter().statusDate.startDate,
                        params.filter().statusDate.endDate,
                        params.filter().lastStatusModifier,
                        params.filter().forwardDestinationId
                    );

                    if(acceptedRequests === undefined){
                            acceptedRequests = filterValues;
                        }

                    //set filter values
                    requestService.setAcceptedFilterValues(filterValues, params.sorting());

                    return requestService.getRequests(acceptedRequests).then(function(requests) {
                        isDateRangeFilteredFirstTime = true;
                        notificationService.sendMessage('crs.request.message.listLoaded', 5000);
                        params.total(requests.total);
                        vm.requests = requests;
                        $timeout(function() {
                            angular.element('.pager li button').removeClass('ng-hide');
                        });
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

            vm.onLastModifiedChange = function(action){
                if(action){
                    vm.lastModifiedDateRange = {
                        startDate: null,
                        endDate: null
                    };
                }
                requestTableParams.reload();
                requestTableParams.filter().statusDate = vm.lastModifiedDateRange;
            };

            var saveColumns = function(){
                notificationService.sendMessage('crs.message.savingColumns', 5000);
                requestService.saveUserPreferences(vm.enabledColumns).then(function(){
                    notificationService.sendMessage('crs.message.savedColumns', 5000);
                });
            };

            var searchTask = function ($event) {
                var keyCode = $event.which || $event.keyCode;
                if (keyCode === 13) {
                    vm.requestTableParams.filter().search = vm.searchText;
                   vm.tableParams.filter().page = 0;
                   changeAcceptedRequestsPage(0);
                    vm.requestTableParams.reload();
                }
            };

            var clearSearch = function () {
                vm.searchText = '';
                vm.requestTableParams.filter().search = vm.searchText;
                vm.tableParams.filter().page = 0;
                changeAcceptedRequestsPage(0);
                vm.requestTableParams.reload();
            };
            
            //watch columns change
            $scope.$watch(function () {
                return vm.enabledColumns;
            }, function (newVal) {
                if (newVal) {
                    requestService.setSavedColumns(newVal);
                }
            });
            
            var onHoldSelectedRequests = function () {
                var action = bulkAction.onHold;
                var selectedRequests = vm.selectedRequests,
                    onHoldRequestIds = [];
                if (selectedRequests &&
                    selectedRequests.items) {
                    angular.forEach(selectedRequests.items, function (isSelected, requestId) {
                        if (isSelected) {
                            onHoldRequestIds.push(requestId);
                        }
                    });
                    if (onHoldRequestIds.length > 0) {
                        var modalInstance = $uibModal.open({
                            templateUrl: 'components/request/modal-change-request-status.html',
                            controller: 'ModalChangeRequestStatusCtrl as modal',
                            resolve: {
                                requestStatus: function () {
                                    return STATISTICS_STATUS.ON_HOLD.value;
                                },
                                data: function () {
                                    return [];
                                }
                            }
                        });

                        modalInstance.result.then(function (rs) {
                            var data = {
                                data: {
                                    additionalInfo: rs
                                },
                                requestIds: onHoldRequestIds
                            };
                            requestService.bulkAction(data, action).then(function (response) {
                                if (response.status === BULK_ACTION_STATUS.STATUS_IN_PROGRESS.value) {
                                    bulkActionRespondingModal(response.id, BULK_ACTION.ON_HOLD.langKey);
                                }
                            });
                        });
                    } else {
                        notificationService.sendMessage('Please select at least a request to move to on hold.', 5000);
                    }
                }
            };

            var waitingForInternalInputSelectedRequests = function () {
                var action = bulkAction.waitingForInternalInput;
                var selectedRequests = vm.selectedRequests,
                    waitingForInternalInputRequestIds = [];
                if (selectedRequests &&
                    selectedRequests.items) {
                    angular.forEach(selectedRequests.items, function (isSelected, requestId) {
                        if (isSelected) {
                            waitingForInternalInputRequestIds.push(requestId);
                        }
                    });
                    if (waitingForInternalInputRequestIds.length > 0) {
                        var modalInstance = $uibModal.open({
                            templateUrl: 'components/request/modal-change-request-status.html',
                            controller: 'ModalChangeRequestStatusCtrl as modal',
                            resolve: {
                                requestStatus: function () {
                                    return STATISTICS_STATUS.ON_HOLD.value;
                                },
                                data: function () {
                                    return [];
                                }
                            }
                        });

                        modalInstance.result.then(function (rs) {
                            var data = {
                                data: {
                                    additionalInfo: rs
                                },
                                requestIds: waitingForInternalInputRequestIds
                            };
                            requestService.bulkAction(data, action).then(function (response) {
                                if (response.status === BULK_ACTION_STATUS.STATUS_IN_PROGRESS.value) {
                                    bulkActionRespondingModal(response.id, BULK_ACTION.INTERNAL_INPUT_NEEDED.langKey);
                                }
                            });
                        });
                    } else {
                        notificationService.sendMessage('Please select at least a request to  move to waiting for internal input.', 5000);
                    }
                }
            };

            var forwardSelectedRequests = function () {
                var action = bulkAction.forward;
                var selectedRequests = vm.selectedRequests,
                    forwardRequestIds = [];
                if (selectedRequests &&
                    selectedRequests.items) {
                    angular.forEach(selectedRequests.items, function (isSelected, requestId) {
                        if (isSelected) {
                            forwardRequestIds.push(requestId);
                        }
                    });
                    if (forwardRequestIds.length > 0) {
                        var modalInstance = $uibModal.open({
                            templateUrl: 'components/request/modal-change-request-status.html',
                            controller: 'ModalChangeRequestStatusCtrl as modal',
                            resolve: {
                                requestStatus: function () {
                                    return STATISTICS_STATUS.FORWARDED.value;
                                },
                                data: function () {
                                    return [];
                                }
                            }
                        });

                        modalInstance.result.then(function (rs) {
                            var data = {
                                data: {
                                    additionalInfo: {
                                        reason: rs
                                    }
                                },
                                requestIds: forwardRequestIds
                            };
                            requestService.bulkAction(data, action).then(function (response) {
                                if (response.status === BULK_ACTION_STATUS.STATUS_IN_PROGRESS.value) {
                                    bulkActionRespondingModal(response.id, BULK_ACTION.FORWARDED.langKey);
                                }
                            });
                        });
                    } else {
                        notificationService.sendMessage('Please select at least a request to move to forward.', 5000);
                    }
                }
            };

            var canForwardRequest = function () {
                var config = configService.getConfigFromServer();
                return (config && config !== undefined && config.forwardAllowed);
            };

            var pendingClarificationSelectedRequests = function () {
                var action = bulkAction.clarification;
                var selectedRequests = vm.selectedRequests,
                    pendingClarificationRequestIds = [];
                if (selectedRequests &&
                    selectedRequests.items) {
                    angular.forEach(selectedRequests.items, function (isSelected, requestId) {
                        if (isSelected) {
                            pendingClarificationRequestIds.push(requestId);
                        }
                    });
                    if (pendingClarificationRequestIds.length > 0) {
                        var modalInstance = $uibModal.open({
                            templateUrl: 'components/request/modal-change-request-status.html',
                            controller: 'ModalChangeRequestStatusCtrl as modal',
                            resolve: {
                                requestStatus: function () {
                                    return STATISTICS_STATUS.CLARIFICATION_NEEDED.value;
                                },
                                data: function () {
                                    return [];
                                }
                            }
                        });

                        modalInstance.result.then(function (rs) {
                            var data = {
                                data: {
                                    additionalInfo: {
                                        reason: rs
                                    }
                                },
                                requestIds: pendingClarificationRequestIds
                            };
                            requestService.bulkAction(data, action).then(function (response) {
                                if (response.status === BULK_ACTION_STATUS.STATUS_IN_PROGRESS.value) {
                                    bulkActionRespondingModal(response.id, BULK_ACTION.CLARIFICATION_NEEDED.langKey);
                                }
                            });
                        });
                    } else {
                        notificationService.sendMessage('Please select at least a request to move to clarification.', 5000);
                    }
                }
            };

            var inceptionElaborationSelectedRequests = function () {
                var action = bulkAction.inceptionElaboration;
                var selectedRequests = vm.selectedRequests,
                    inceptionElaborationRequestIds = [];
                if (selectedRequests &&
                    selectedRequests.items) {
                    angular.forEach(selectedRequests.items, function (isSelected, requestId) {
                        if (isSelected) {
                            inceptionElaborationRequestIds.push(requestId);
                        }
                    });
                    if (inceptionElaborationRequestIds.length > 0) {
                        var modalInstance = $uibModal.open({
                            templateUrl: 'components/request/modal-change-request-status.html',
                            controller: 'ModalChangeRequestStatusCtrl as modal',
                            resolve: {
                                requestStatus: function () {
                                    return 'inInceptionElaboration';
                                },
                                data: function () {
                                    return [];
                                }
                            }
                        });

                        modalInstance.result.then(function (rs) {
                            var data = {
                                data: {
                                    additionalInfo: {
                                        contentRequestUrl: rs.contentRequestUrl,
                                        trackerId: rs.trackerId
                                    }
                                },
                                requestIds: inceptionElaborationRequestIds
                            };
                            requestService.bulkAction(data, action).then(function (response) {
                                if (response.status === BULK_ACTION_STATUS.STATUS_IN_PROGRESS.value) {
                                    bulkActionRespondingModal(response.id, BULK_ACTION.IN_INCEPTION_ELABORATION.langKey);
                                }
                            });
                        });
                    } else {
                        notificationService.sendMessage('Please select at least a request to move to inception/elaboration.', 5000);
                    }
                }
            };

            var resolveWithoutContentChangesSelectedRequests = function () {
                var action = bulkAction.resolveWithoutContentChanges;
                var selectedRequests = vm.selectedRequests,
                requestIds = [];
                if (selectedRequests &&
                    selectedRequests.items) {
                    angular.forEach(selectedRequests.items, function (isSelected, requestId) {
                        if (isSelected) {
                            requestIds.push(requestId);
                        }
                    });
                    if (requestIds.length > 0) {
                        var modalInstance = $uibModal.open({
                            templateUrl: 'components/request/modal-change-request-status.html',
                            controller: 'ModalChangeRequestStatusCtrl as modal',
                            resolve: {
                                requestStatus: function () {
                                    return 'resolveWithoutChanges';
                                },
                                data: function () {
                                    return [];
                                }
                            }
                        });

                        modalInstance.result.then(function (rs) {
                            var data = {
                                data: {
                                    additionalInfo: {
                                        reason: rs
                                    }
                                },
                                requestIds: requestIds
                            };
                            requestService.bulkAction(data, action).then(function (response) {
                                if (response.status === BULK_ACTION_STATUS.STATUS_IN_PROGRESS.value) {
                                    bulkActionRespondingModal(response.id, BULK_ACTION.RESOLVED_WITHOUT_CONTENT_CHANGES.langKey);
                                }
                            });
                        });
                    } else {
                        notificationService.sendMessage('Please select at least a request to move to Resolved Without Content Changes.', 5000);
                    }
                }
            };

            var awaitingAgreementComplianceSelectedRequests = function () {
                var action = bulkAction.awaitingAgreementCompliance;
                var selectedRequests = vm.selectedRequests,
                requestIds = [];
                if (selectedRequests &&
                    selectedRequests.items) {
                    angular.forEach(selectedRequests.items, function (isSelected, requestId) {
                        if (isSelected) {
                            requestIds.push(requestId);
                        }
                    });
                    if (requestIds.length > 0) {
                        var modalInstance = $uibModal.open({
                            templateUrl: 'components/request/modal-change-request-status.html',
                            controller: 'ModalChangeRequestStatusCtrl as modal',
                            resolve: {
                                requestStatus: function () {
                                    return 'awaitingAgreementCompliance';
                                },
                                data: function () {
                                    return [];
                                }
                            }
                        });

                        modalInstance.result.then(function (rs) {
                            var data = {
                                data: {
                                    additionalInfo: {
                                        reason: rs
                                    }
                                },
                                requestIds: requestIds
                            };
                            requestService.bulkAction(data, action).then(function (response) {
                                if (response.status === BULK_ACTION_STATUS.STATUS_IN_PROGRESS.value) {
                                    bulkActionRespondingModal(response.id, BULK_ACTION.AWAITING_AGREEMENT_COMPLIANCE.langKey);
                                }
                            });
                        });
                    } else {
                        notificationService.sendMessage('Please select at least a request to move to Awaiting Agreement Compliance.', 5000);
                    }
                }
            };

            vm.clearSearch = clearSearch;
            vm.inceptionElaborationSelectedRequests = inceptionElaborationSelectedRequests;
            vm.resolveWithoutContentChangesSelectedRequests = resolveWithoutContentChangesSelectedRequests;
            vm.awaitingAgreementComplianceSelectedRequests = awaitingAgreementComplianceSelectedRequests;
            vm.pendingClarificationSelectedRequests = pendingClarificationSelectedRequests;
            vm.canForwardRequest = canForwardRequest;
            vm.forwardSelectedRequests = forwardSelectedRequests;
            vm.searchTask = searchTask;
            vm.onHoldSelectedRequests = onHoldSelectedRequests;
            vm.waitingForInternalInputSelectedRequests = waitingForInternalInputSelectedRequests;
            vm.tableParams = requestTableParams;
            vm.assignSelectedRequests = assignSelectedRequests;
            vm.assignSelectedRequestsToStaff = assignSelectedRequestsToStaff;
            vm.unassignSelectedRequests = unassignSelectedRequests;
            vm.pushSelectedRequest = pushSelectedRequest;
            vm.getAuthorName = getAuthorName;
            vm.getStaffName = getStaffName;
            vm.toggleShowUnassignedRequests = toggleShowUnassignedRequests;
            vm.saveColumns = saveColumns;
            vm.addNote = addNote;
            vm.isAdmin = false;
            vm.isViewer = false;
            vm.loadingProjects = true;
            vm.loadingAuthors = true;
            vm.showUnassignedRequests = false;
            vm.rejectSelectedRequests = rejectSelectedRequests;
            vm.projects = [];
            vm.authors = [];
            vm.staffs = [];
            vm.showFilter = false;
            vm.daterange = {
                startDate: null,
                endDate: null
            };
            vm.lastModifiedDateRange = {
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
