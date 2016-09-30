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
        '$uibModal',
		'utilsService',
        '$scope',
        'scaService',
        'BULK_ACTION_STATUS',
        'BULK_ACTION',
        function ($filter, $sce, crsJiraService, NgTableParams, requestService, notificationService, accountService, jiraService, $routeParams, $uibModal, utilsService, $scope, scaService, BULK_ACTION_STATUS, BULK_ACTION) {
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
                        placeholder: "Summaries..."
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
                addNote: 'ADD_NOTE'
            };

            var initView = function () {
                vm.selectedRequests = {checked: false, items: {}, requests: {}};
                vm.selectedSubmittedRequests = {checked: false, items: {}, requests: {}};
                vm.selectedMyAssignedRequests = {checked: false, items: {}, requests: {}};
                vm.showClosedRequests = $routeParams.showClosedRequest?$routeParams.showClosedRequest: false;
				
				vm.requestStatus = vm.requestStatus.sort(function(a, b) {
					return utilsService.compareStrings(a.title, b.title);
				});
				
				vm.requestTypes = vm.requestTypes.sort(function(a, b) {
					return utilsService.compareStrings(a.title, b.title);
				});
				
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
                        if(subbmitedRequests !== undefined && $routeParams.cache !== false){
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
                        if(myRequests !== undefined && $routeParams.cache !== false){
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

                //load requestors
                loadRequestors();

                //load projects
                loadProjects();

                //load max size
                getMaxSize();
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

            var getAuthorName = function (authorKey) {
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

            //watch for check all checkbox my requests list
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

            //watch for check all checkbox submitted requests list
            $scope.$watch(function() {
                return vm.selectedSubmittedRequests.checked;
            }, function(newVal) {
                if(vm.requests){
                    angular.forEach(vm.requests.items, function(item) {
                        if (angular.isDefined(item.id)) {
                            vm.selectedSubmittedRequests.items[item.id] = newVal;
                            vm.selectedSubmittedRequests.requests[item.id] = item;
                        }
                    }); 
                }
            });

            //watch for check all checkbox my assigned requests list
            $scope.$watch(function() {
                return vm.selectedMyAssignedRequests.checked;
            }, function(newVal) {
                if(vm.requests){
                    angular.forEach(vm.requests.items, function(item) {
                        if (angular.isDefined(item.id)) {
                            vm.selectedMyAssignedRequests.items[item.id] = newVal;
                            vm.selectedMyAssignedRequests.requests[item.id] = item;
                        }
                    }); 
                }
            });

            var assignSelectedRequests = function() {
                if (vm.authors.length > 0 && vm.projects.length > 0) {
                    var selectedRequests = vm.selectedMyAssignedRequests,
                        selectedRequestIds = [],
                        defaultSummary;
                    if (selectedRequests &&
                        selectedRequests.items) {
                        angular.forEach(selectedRequests.items, function(isSelected, requestId) {
                            if (isSelected) {
                                selectedRequestIds.push(requestId);
                            }
                        });

                        if(selectedRequestIds.length > maxSize){
                            notificationService.sendMessage('Cannot assign requests! The list cannot be longer than ' + maxSize + ' requests.', 5000);
                        }else if (selectedRequestIds.length > 0) {
                            openAssignRequestModal(selectedRequestIds, defaultSummary);
                        }else {
                            notificationService.sendMessage('Please select at least a request to assign.', 5000);
                        }
                    }
                }
            };

            var openAssignRequestModal = function(selectedRequestIds) {
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
                            return '';
                        }
                    }
                });

                modalInstance.result.then(function(rs) {
                    // notificationService.sendMessage('Processing...');
                    var action = bulkAction.assignAuthor;
                    var assigningData = {
                        data: {
                            assignee: rs.assignee? rs.assignee.key : null,
                            project: rs.project.key,
                            summary: rs.summary
                        },
                        requestIds: selectedRequestIds
                    };
                    requestService.bulkAction(assigningData, action).then(function (response) {
                        if(response.status === BULK_ACTION_STATUS.STATUS_IN_PROGRESS.value){
                            bulkActionRespondingModal(response.id, BULK_ACTION.ASSIGN_AUTHOR.langKey);
                        }
                    }, function(error){
                        notificationService.sendMessage(error.message, 5000);
                    });
                });
            };

            var acceptAndAssignSelectedRequests = function() {
                if (vm.authors.length > 0 && vm.projects.length > 0) {
                    var selectedRequests = vm.selectedMyAssignedRequests,
                        selectedRequestIds = [],
                        action = bulkAction.assignToAuthor;
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
                                        bulkActionRespondingModal(response.id, BULK_ACTION.ACCEPT_AND_ASSIGN.langKey);
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

            var openAssignRequestToStaffModal = function(selectedRequestIds) {
                var dataList = [];
                var action = bulkAction.assignToStaff;
                var unassignedUser = {
                    displayName: 'Unassigned ',
                    id: null,
                    key: null
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

            var assignSelectedRequestsToStaff = function() {
                if (vm.staffs.length > 0) {
                    var selectedRequests = vm.selectedSubmittedRequests,
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

            var acceptSelectedRequests = function(){
                if (vm.staffs.length > 0) {
                    var selectedRequests = vm.selectedSubmittedRequests,
                        selectedRequestIds = [],
                        action = bulkAction.accept;
                    if (selectedRequests && selectedRequests.items) {
                        notificationService.sendMessage('Accepting requests');
                        angular.forEach(selectedRequests.items, function(isSelected, requestId) {
                            if (isSelected) {
                                selectedRequestIds.push(requestId);
                            }
                        });

                        if(selectedRequestIds.length > maxSize){
                            notificationService.sendMessage('Cannot accept requests! The list cannot be longer than ' + maxSize + ' requests.', 5000);
                        }else if (selectedRequestIds.length > 0) {
                            var acceptingData = {
                                data: {},
                                requestIds: selectedRequestIds
                            };
                            requestService.bulkAction(acceptingData, action).then(function(response) {
                                if(response.status === BULK_ACTION_STATUS.STATUS_IN_PROGRESS.value){
                                    bulkActionRespondingModal(response.id, BULK_ACTION.ACCEPT.langKey);
                                }
                            });
                        }else {
                            notificationService.sendMessage('Please select at least a request to accept.', 5000);
                        }
                    }
                }
            };

            var addNote = function(){
                var selectedRequests,
                    selectedRequestIds = [];
                    if($routeParams.list === 'submitted-requests'){
                        selectedRequests = vm.selectedSubmittedRequests;
                    }else{
                        selectedRequests = vm.selectedMyAssignedRequests;
                    }
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

            var removeSelectedRequests = function () {
                var selectedRequests = vm.selectedRequests,
                    removingRequestIds = [];
                if (selectedRequests &&
                    selectedRequests.items) {
                    angular.forEach(selectedRequests.items, function (isSelected, requestId) {
                        if (isSelected) {
                            removingRequestIds.push(requestId);
                            vm.selectedRequests.items[requestId]=false;
                            vm.selectedRequests.checked = false;
                        }
                    });
                    if (removingRequestIds.length > 0) {
                        var modalInstance = $uibModal.open({
                            templateUrl: 'components/request/confirm-modal.html',
                            controller: 'ConfirmModalCtrl as vm',
                            resolve: {
                                number: function() {
                                    return removingRequestIds.length;
                                }
                            }
                        });

                        modalInstance.result.then(function() {
                            notificationService.sendMessage('Removing Requests...', 8000);
                            requestService.removeRequests(removingRequestIds).then(function () {
                                
                                if (vm.tableParams) {
                                    vm.tableParams.reload();
                                    notificationService.sendMessage('Requests have been removed successfully!', 5000);
                                }
                                if (vm.submittedTableParams) {
                                    vm.submittedTableParams.reload();
                                    notificationService.sendMessage('Requests have been removed successfully!', 5000);
                                }

                            }, function(error){
                                notificationService.sendMessage(error.message, 5000);
                            });
                        });
                    }else {
                        notificationService.sendMessage('Please select at least a request to remove.', 5000);
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

            var submitSelectedRequests = function () {
                // notificationService.sendMessage('Processing...');
                var selectedRequests = vm.selectedRequests,
                    requestIds = [],
                    action = bulkAction.submit;
                    
                if (selectedRequests &&
                    selectedRequests.items) {
                    angular.forEach(selectedRequests.items, function (isSelected, requestId) {
                        if (isSelected) {
                            requestIds.push(requestId);
                        }
                    });

                    if(requestIds.length > maxSize){
                        notificationService.sendMessage('Cannot submit! The list cannot be longer than ' + maxSize + ' requests.', 5000);
                    }else if (requestIds.length > 0) {
                            var submitingData = {
                                data: {},
                                requestIds: requestIds
                            };
                            requestService.bulkAction(submitingData, action).then(function (response) {
                                if(response.status === BULK_ACTION_STATUS.STATUS_IN_PROGRESS.value){
                                    bulkActionRespondingModal(response.id, BULK_ACTION.SUBMIT.langKey);
                                }
                                
                            }, function(error){
                                notificationService.sendMessage(error.message, 5000);
                            });
                    }else {
                        notificationService.sendMessage('Please select at least a request to submit.', 5000);
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
                    switch($routeParams.list){
                        case 'requests':
                              vm.selectedRequests = { checked: false, items: {}, requests: {} };
                              vm.tableParams.reload();
                              break;
                        case 'submitted-requests':
                              vm.selectedSubmittedRequests = { checked: false, items: {}, requests: {} };
                              vm.submittedTableParams.reload();
                              break;
                        case 'my-assigned-requests':
                              vm.selectedMyAssignedRequests = { checked: false, items: {}, requests: {} };
                              vm.assignedRequestTableParams.reload();
                              break;
                        default: 
                              vm.selectedRequests = { checked: false, items: {}, requests: {} };
                              vm.tableParams.reload();  
                              break; 
                    }
                    
                });
            };

            var convertDateToMilliseconds = function(date){
                var milliseconds = new Date(date);
                return milliseconds.getTime();
            };

            var buildRequestList = function(typeList, page, pageCount, search, sortFields, sortDirs, batchRequest, fsn, jiraTicketId, requestDateFrom, requestDateTo, topic, manager, status, author, requestId, requestType, showClosedRequests){
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
                requestList.showClosedRequests = showClosedRequests;
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
						manager: $routeParams.manager,
                        requestDate: {
                            startDate: null,
                            endDate: null
                        },

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
                            params.filter().requestType,
                            vm.showClosedRequests
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
                            vm.selectedRequests = { checked: false, items: {}, requests: {} };
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
                        manager: $routeParams.manager,
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
                            vm.assignee,
                            params.filter().status,
                            params.filter().ogirinatorId,
                            params.filter().requestId,
                            params.filter().requestType,
                            vm.showClosedRequests
                        );

                        if(myAssignedRequests === undefined){
                            myAssignedRequests = filterValues;
                        }

                        //set filter values
                        requestService.setAssignedFilterValues(filterValues);
                        return requestService.getRequests(myAssignedRequests).then(function (requests) {
                            isDateRangeFilteredFirstTime = true;
                            notificationService.sendMessage('crs.request.message.listLoaded', 5000);
                            params.total(requests.total);
                            vm.requests = requests;
                            vm.selectedMyAssignedRequests = { checked: false, items: {}, requests: {} };
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
                        manager: $routeParams.manager,
						author: $routeParams.ogirinatorId,
                        requestDate: {
                            startDate: null,
                            endDate: null
                        }
                    },
                    
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
                        notificationService.sendMessage('crs.request.message.listLoading');

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
                            params.filter().ogirinatorId,
                            params.filter().requestId,
                            params.filter().requestType,
                            vm.showClosedRequests
                        );
                        if(subbmitedRequests === undefined){
                            subbmitedRequests = filterValues;
                        }
                        //set filter values
                        requestService.setSubmittedFilterValues(filterValues);
                        
                        return requestService.getRequests(subbmitedRequests).then(function (requests) {
                            isDateRangeFilteredFirstTime = true;
                            notificationService.sendMessage('crs.request.message.listLoaded', 5000);
                            params.total(requests.total);
                            vm.requests = requests;
                            vm.selectedSubmittedRequests = { checked: false, items: {}, requests: {} };
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

            var toggleShowClosedRequests = function(list) {
                vm.selectedRequests = { checked: false, items: {}, requests: {} };
                vm.showClosedRequests = !vm.showClosedRequests;
                switch(list){
                    case 'my-requests':
                          vm.tableParams.reload();
                          break;
                    case 'submitted-requests':
                          vm.submittedTableParams.reload();
                          break;
                    case 'my-assigned-requests':
                          vm.assignedRequestTableParams.reload();
                          break;
                }
                
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
            vm.toggleShowClosedRequests = toggleShowClosedRequests;
            vm.submitSelectedRequests = submitSelectedRequests;
            vm.showClosedRequests = false;
            vm.assignSelectedRequestsToStaff = assignSelectedRequestsToStaff;
            vm.acceptSelectedRequests = acceptSelectedRequests;
            vm.assignSelectedRequests = assignSelectedRequests;
            vm.acceptAndAssignSelectedRequests = acceptAndAssignSelectedRequests;
            vm.addNote = addNote;
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
              format: 'YYYY-MM-DD',
              showDropdowns: true,
              type: 'moment'
            };
            
            initView();
        }
    ]);