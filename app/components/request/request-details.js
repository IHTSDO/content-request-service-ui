/*jshint newcap:false*/
'use strict';

angular
    .module('conceptRequestServiceApp.request')
    .controller('RequestDetailsCtrl', [
        '$scope',
        '$rootScope',
        '$routeParams',
        '$location',
        '$anchorScroll',
        '$uibModal',
        '$sce',
        '$q',
        'requestService',
        'notificationService',
        'requestMetadataService',
        'objectService',
        'snowowlService',
        'snowowlMetadataService',
        'crsJiraService',
        'scaService',
        'accountService',
        'REQUEST_METADATA_KEY',
        'REQUEST_TYPE',
        'CONCEPT_EDIT_EVENT',
        'REQUEST_STATUS',
        'REQUEST_INPUT_MODE',
        'jiraService',
        '$timeout',
		'utilsService',
        '$filter',
        function($scope, $rootScope, $routeParams, $location, $anchorScroll, $uibModal, $sce, $q, requestService, notificationService, requestMetadataService, objectService, snowowlService, snowowlMetadataService, crsJiraService, scaService, accountService, REQUEST_METADATA_KEY, REQUEST_TYPE, CONCEPT_EDIT_EVENT, REQUEST_STATUS, REQUEST_INPUT_MODE, jiraService, $timeout, utilsService, $filter) {
            var vm = this;
            var translateFilter = $filter('translate');
            var translateRequestTypeFilter = $filter('requestType');
            var autoFillPreferredTerm = true;

            var REQUEST_MODE = {
                NEW: { value: 'new', langKey: 'crs.request.requestMode.newRequest' },
                EDIT: { value: 'edit', langKey: 'crs.request.requestMode.editRequest' },
                PREVIEW: { value: 'preview', langKey: 'crs.request.requestMode.previewRequest' },
                VIEW: { value: 'view', langKey: 'crs.request.requestMode.viewRequest' }
            };
            var DESCRIPTION_TYPE = {
                FSN: 'FSN',
                SYN: 'SYNONYM',
                DEF: 'TEXT_DEFINITION'
            };
            var ACCEPTABILITY_DIALECT = {
                EN_US: '900000000000509007',
                EN_GB: '900000000000508004'
            };
            var ACCEPTABILITY_VALUE = {
                PREFERRED: 'PREFERRED',
                ACCEPTABLE: 'ACCEPTABLE'
            };
            var RELATIONSHIP_CHARACTERISTIC_TYPE = {
                STATED: "STATED_RELATIONSHIP",
                INFERRED: "INFERRED_RELATIONSHIP"
            };
            var mode = $routeParams.mode,
                param = $routeParams.param,
                inputMode = $routeParams.inputMode,
                kbMode = $routeParams.kb;

            var requestId,
                requestType;

            var prevPage = '/dashboard';

            var permanentlyDisableSimpleMode = false;

            var identifyPageMode = function(pm) {
                for (var requestModeKey in REQUEST_MODE) {
                    if (REQUEST_MODE.hasOwnProperty(requestModeKey) &&
                        REQUEST_MODE[requestModeKey].value === pm) {
                        return REQUEST_MODE[requestModeKey];
                    }
                }

                return null;
            };

            var identifyInputMode = function(im) {
                if (im !== undefined && im !== null) {
                    for (var inputModeKey in REQUEST_INPUT_MODE) {
                        if (REQUEST_INPUT_MODE.hasOwnProperty(inputModeKey) &&
                            REQUEST_INPUT_MODE[inputModeKey].value === im) {
                            return REQUEST_INPUT_MODE[inputModeKey];
                        }
                    }
                }

                return null;
            };

            var isValidViewParams = function() {
                var pageMode,
                    isValidPageMode = false,
                    isValidParam = false,
                    isValidInputMode = false;

                // check valid mode
                pageMode = identifyPageMode(mode);
                isValidPageMode = (pageMode !== undefined && pageMode !== null);

                // check valid param
                switch (pageMode) {
                    case REQUEST_MODE.NEW:
                        isValidParam = (requestService.identifyRequestType(param) !== null);
                        isValidInputMode = (identifyInputMode(inputMode) !== null);
                        break;
                    case REQUEST_MODE.EDIT:
                    case REQUEST_MODE.PREVIEW:
                    case REQUEST_MODE.VIEW:
                        isValidParam = (param !== undefined && param !== null);
                        isValidInputMode = true;
                        break;
                }

                return isValidPageMode && isValidParam && isValidInputMode;
            };

            /*var hideErrorMessage = function () {
                vm.msgError = null;
            };*/

            var hideSuccessMessage = function() {
                vm.msgSuccess = null;
            };

            var showErrorMessage = function(msg) {
                hideSuccessMessage();
                var splitMsg = msg.split(": ");
                
                if(splitMsg[1]){
                    var substringMsg = splitMsg[1].substring(1, splitMsg[1].indexOf("]"));
                    if(substringMsg){
                        var listId = substringMsg.split(", ");
                        if(listId){
                           vm.listMsgHtml = [];
                            for(var i in listId){
                                var htmlTemplate = '<div class="alert alert-danger">' + splitMsg[0] + '&nbsp; <a style="color: #00a6e5" href="/#/requests/preview/' + listId[i] + '">' + listId[i] + '</a></div>';
                                vm.listMsgHtml.push(htmlTemplate);
                            }  
                        }
                    }
                }
                
                vm.msgError = msg;

                $anchorScroll('messagePaneLocation');
            };

            /*var showSuccessMessage = function (msg) {
                hideErrorMessage();
                vm.msgSuccess = msg;
                $window.scrollTop = 0;
            };*/

            var loadProjects = function() {
                vm.loadingProjects = true;
                scaService.getProjects().then(function(response) {
					response.sort(function(a, b) {
						return utilsService.compareStrings(a.title, b.title);
					});
                    vm.projects = response;
                    requestService.setProjectsList(vm.projects);
                }).finally(function() {
                    vm.loadingProjects = false;
                });
            };

            var loadAuthors = function() {
                var jiraConfig = jiraService.getJiraConfig();
                var groupName = jiraConfig['author-group'];
                vm.loadingAuthors = true;
                return crsJiraService.getAuthorUsers(0, 50, true, [], groupName).then(function(users) {
                    vm.authors = users;
                    requestService.setAuthorsList(vm.authors);
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
                    requestService.setStaffsList(vm.staffs);
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
                    requestService.setRequestorsList(vm.requestors);
                    return users;
                }).finally(function() {
                    vm.loadingAuthors = false;
                });
            };

            var loadSemanticTags = function(){
                return crsJiraService.getSemanticTags().then(function(semanticTags){
                    vm.semanticTags = semanticTags;
                    vm.semanticTags.sort(function(a, b) {
                        return utilsService.compareStrings(a.value, b.value);
                    });
                    requestService.setSemanticTags(semanticTags);
                    return semanticTags;
                });
            };

            var pushOtherSemanticTag = function(value){
                if(vm.semanticTags){
                    var tmp = [];
                    for(var i in vm.semanticTags){
                        tmp.push(vm.semanticTags[i].value);
                    }
                    if(tmp.indexOf(value) === -1) {
                        var obj = {};
                        obj.value = value;
                        vm.semanticTags.push(obj);
                    }
                }
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
                        // if (vm.authors[i].key !== authorKey) {
                        //     return authorKey;
                        // }
                        if (usersList[i].key === authorKey) {
                            //return vm.authors[i].displayName;
                            return $sce.trustAsHtml([
                                '<img style="padding-bottom:2px" src="' + usersList[i].avatarUrls['16x16'] + '"/>',
                                '<span style="vertical-align:middle">&nbsp;' + usersList[i].displayName + '</span>',
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
                                '<img style="padding-bottom:2px" src="' + vm.staffs[i].avatarUrls['16x16'] + '"/>',
                                '<span style="vertical-align:middle">&nbsp;' + vm.staffs[i].displayName + '</span>'
                            ].join(''));
                        }
                    }
                }
            };

            var buildNewConceptDefinitionOfChanges = function(changeId) {
                return {
                    changeId: (changeId) ? changeId : null,
                    changeType: REQUEST_TYPE.NEW_CONCEPT.value,
                    changed: true
                };
            };

            var buildOtherRequestDefinitionOfChanges = function(changeId) {
                return {
                    changeId: (changeId) ? changeId : null,
                    changeType: REQUEST_TYPE.OTHER.value,
                    changed: true
                };
            };

            var buildChangeConceptDefinitionOfChanges = function() {
                return {
                    changeId: null,
                    changeType: REQUEST_TYPE.CHANGE_RETIRE_CONCEPT.value,
                    changed: true
                };
            };

            vm.reFilterRelationship = true;

            vm.filterRelationshipType = function(relationshipType, element) {
                if (vm.originalConcept.relationships !== undefined && vm.reFilterRelationship) {
                    vm.relationshipsFilter = vm.originalConcept.relationships.filter(function(obj) {
                        return (obj.characteristicType === relationshipType && obj.active === true);
                    });
                    if (vm.pageMode !== REQUEST_MODE.NEW && element === undefined && relationshipType !== undefined && vm.originalConcept !== null && vm.requestType.value === 'RETIRE_RELATIONSHIP') {
                        var arr = vm.originalConcept.relationships;
                        var isRelationshipActive = function(obj) {
                            var requestItems = vm.requestItems;
                            for (var i = 0; i < requestItems.length; i++) {
                                obj.viewName = obj.type.fsn + " " + obj.target.fsn;
                                if (requestItems[i].relationshipId !== null && obj.active === true && obj.characteristicType === relationshipType) {
                                    return true;
                                }
                            }
                            return false;
                        };
                        vm.relationshipsFilter = arr.filter(function(obj) {
                            return isRelationshipActive(obj);
                        });
                        for (var i in vm.requestItems) {
                            for (var j in vm.originalConcept.relationships) {
                                vm.originalConcept.relationships[j].viewName = vm.originalConcept.relationships[j].type.fsn + " " + vm.originalConcept.relationships[j].target.fsn;
                                if (vm.requestItems[i].relationshipId !== null || vm.requestItems[i].relationshipId !== undefined) {
                                    if (vm.requestItems[i].relationshipId === vm.originalConcept.relationships[j].relationshipId) {
                                        vm.originalConcept.relationships[j].ticked = true;
                                    }
                                }
                            }
                        }
                        vm.selectedRelationships = vm.requestItems ? [vm.requestItems] : [];
                    }
                }
            };

            $scope.$watch(function() {
                return vm.originalConcept;
            }, function(newVal) {
                if (newVal !== null) {
                    vm.filterRelationshipType(vm.request.relationshipCharacteristicType);
                    vm.reFilterRelationship = true;
                    vm.isShowFilter = true;

                }
            });

            $scope.$on('viewTaxonomy', function() {
                vm.actionTab = 1;
                $timeout(function() {
                    angular.element('.sidebar-tabs>li>a').eq(0).click();
                });
            });

            var initView = function() {

                //load semantic tag
                vm.semanticTags = requestService.getSemanticTags();
                if(!vm.semanticTags){
                    loadSemanticTags();
                }

                var isValid = isValidViewParams();
                var originConcept;

                // check permission
                accountService.checkUserPermission().then(function(rs) {
                    vm.permissionChecked = true;
                    vm.isAdmin = (rs.isAdmin === true);
                    vm.isViewer = (rs.isViewer === true);
                    vm.isStaff = (rs.isStaff === true);
                    vm.isRequester = (rs.isRequester === true);
                });

                // load authors
                vm.authors = requestService.getAuthorsList();
                if(!vm.authors){
                    loadAuthors();
                }
                
                //load staffs
                vm.staffs = requestService.getStaffsList();
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

                //load topic options
                vm.topicOptions = requestService.getTopics();
                if(!vm.topicOptions){
                    loadTopicOptions();
                }

                //check pre page
                checkPrePage();

                if (!isValid) {
                    showErrorMessage('crs.request.message.error.invalidPage');
                } else {
                    vm.pageMode = identifyPageMode(mode);
                    //delete current batch option
                    if(vm.pageMode === REQUEST_MODE.NEW){
                        vm.sourceTerminologies.splice(1, 1);
                        vm.destinationTerminologies.splice(1, 1);
                    }

                    switch (vm.pageMode) {
                        case REQUEST_MODE.NEW:
                            requestId = null;
                            requestType = requestService.identifyRequestType(param);
                            $rootScope.pageTitles = ['crs.request.details.title.new', requestType.langKey];

                            vm.request = {
                                id: requestId,
                                additionalFields: {},
                                characteristicType: null,
                                requestHeader: {
                                    status: REQUEST_STATUS.DRAFT.value,
                                    requestDate: new Date().getTime()
                                }
                            };

                            vm.request.showRel = 'STATED_RELATIONSHIP';

                            if (requestType === REQUEST_TYPE.NEW_CONCEPT) {
                                originConcept = objectService.getNewConcept();
                                originConcept.definitionOfChanges = buildNewConceptDefinitionOfChanges();
                                vm.originalConcept = originConcept;
                                vm.concept = angular.copy(vm.originalConcept);
                            }

                            if (requestType === REQUEST_TYPE.RETIRE_RELATIONSHIP) {
                                vm.request.relationshipCharacteristicType = RELATIONSHIP_CHARACTERISTIC_TYPE.STATED;
                            }

                            if (requestType === REQUEST_TYPE.OTHER) {
                                vm.request.definitionOfChanges = buildOtherRequestDefinitionOfChanges();
                                vm.disableDirectMode = true;
                            }


                            accountService.getAccountInfo().then(function(accountDetails) {
                                vm.request.requestHeader.ogirinatorId = accountDetails.login;
                            });
                            
                            $rootScope.newConceptRequestType = requestType.value;
                            vm.requestType = requestType;
                            vm.isValidViewParams = isValid;
                            vm.inputMode = identifyInputMode(inputMode);
                            break;
                        case REQUEST_MODE.EDIT:
                        case REQUEST_MODE.PREVIEW:
                        case REQUEST_MODE.VIEW:

                            requestId = param;
                            //$rootScope.pageTitles = ['crs.request.details.title.edit'];
                            initBreadcrumb(requestId);

                            vm.disableSimpleMode = true;
                            loadRequest().then(function(requestData) {
                                var requestType = requestService.identifyRequestType(vm.request.requestType);
                                var inputMode = identifyInputMode(vm.request.inputMode);

                                accountService.getAccountInfo().then(function(accountDetails) {
                                    vm.requestOwner = accountDetails.login;
                                    if (requestData.requestHeader.ogirinatorId === accountDetails.login &&
                                        (vm.pageMode === REQUEST_MODE.VIEW ||
                                            (vm.pageMode === REQUEST_MODE.PREVIEW &&
                                                requestData.requestHeader.status === REQUEST_STATUS.DRAFT.value))) {
                                        vm.pageMode = REQUEST_MODE.EDIT;
                                    } else if (vm.pageMode === REQUEST_MODE.VIEW) {
                                        vm.pageMode = REQUEST_MODE.PREVIEW;
                                    }
                                });

                                if (requestType) {
                                    //$rootScope.pageTitles.push(vm.request.id);
                                    vm.requestType = requestType;
                                    vm.inputMode = inputMode;
                                    vm.isValidViewParams = isValid;

                                    permanentlyDisableSimpleMode = (vm.inputMode === REQUEST_INPUT_MODE.DIRECT);
                                    vm.disableSimpleMode = (vm.inputMode === REQUEST_INPUT_MODE.DIRECT);
                                    vm.disableDirectMode = (requestType === REQUEST_TYPE.OTHER);

                                    notificationService.sendMessage('crs.request.message.requestLoaded', 5000);
                                } else {
                                    showErrorMessage('crs.request.message.error.invalidPage');
                                }
                            });
                            break;
                    }
                    
                    loadRequestMetadata();
                }
            };

            var initBreadcrumb = function(requestId) {
                var tmpUrl;
                if (kbMode === true) {
                    $rootScope.pageTitles.push({ url: '#' + $location.path(), label: requestId });
                } else {
                    $rootScope.pageTitles = [
                        { url: '#/requests', label: 'crs.request.list.title.requests' },
                        { url: '#' + $location.path(), label: requestId }
                    ];
                }

                if ($rootScope.pageTitles.length > 1) {
                    for (var i = $rootScope.pageTitles.length - 2; i >= 0; i--) {
                        tmpUrl = $rootScope.pageTitles[i].url;
                        if (tmpUrl) {
                            prevPage = tmpUrl.substring(tmpUrl.indexOf('#') + 1);
                            break;
                        }
                    }
                }
            };

            var checkPrePage = function(){
                var listObj = requestService.getCurrentList();
                if(listObj){
                    vm.isCameFromRequestList = true;
                }
            };

            var loadRequest = function() {
                var originConcept;

                notificationService.sendMessage('crs.request.message.requestLoading', 0);

                vm.request = null;

                return requestService.getRequest(requestId).then(function(requestData) {
                    // build request
                    vm.request = buildRequestFromRequestData(requestData);
                    vm.request.showRel = vm.request.relationshipCharacteristicType;

                    vm.requestItems = requestData.requestItems;
                    if (requestData.requestType === REQUEST_TYPE.NEW_CONCEPT.value) {
                        for (var i in vm.requestItems) {
                            for (var j in vm.requestItems[i].proposedParents) {
                                if (vm.requestItems[i].proposedParents[j].fsn === null) {
                                    var tmp = vm.requestItems[i].proposedParents[j].conceptId;
                                    vm.requestItems[i].proposedParents[j].fsn = tmp;
                                }
                            }
                        }
                    }
                    // get original concept
                    // if(requestData.concept !== null){
                    if (requestData.requestType === REQUEST_TYPE.NEW_CONCEPT.value) {
                        originConcept = objectService.getNewConcept();
                        originConcept.definitionOfChanges = buildNewConceptDefinitionOfChanges();
                        vm.originalConcept = originConcept;

                        //return null;
                    } else if (requestData.requestType === REQUEST_TYPE.OTHER.value) {
                        vm.originalConcept = null;
                        vm.request.definitionOfChanges = buildOtherRequestDefinitionOfChanges();
                    } else {
                        snowowlService.getFullConcept(null, null, requestData.requestItems[0].conceptId).then(function(response) {
                            vm.originalConcept = response;
                            for (var i in requestData.requestItems) {
                                for (var j in vm.originalConcept.relationships) {
                                    var arr = [];
                                    if (vm.originalConcept.relationships[j].relationshipId === requestData.requestItems[i].relationshipId) {
                                        var obj = {};
                                        obj = vm.originalConcept.relationships[j];
                                        arr.push(obj);

                                        if (arr.length === 0 || arr.length === 2) {
                                            return;
                                        } else if (arr.length === 1) {
                                            if(obj.active === false){
                                                var rel = angular.copy(obj);
                                                rel.active = true;
                                                vm.originalConcept.relationships.push(rel);
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }

                    // }else{
                    //     vm.originalConcept = {
                    //         conceptId: requestData.concept.conceptId,
                    //         fsn: requestData.concept.fsn
                    //     };
                    //     return snowowlService.getFullConcept(null, null, requestData.concept.conceptId).then(function (response) {
                    //         originalConcept = response;
                    //         vm.originalConcept = response;
                    //     });
                    // }

                    // rebuild concept from request data

                    vm.concept = requestData.concept;
                    $timeout(function () {
                        angular.element('#auto-resize').css('height', angular.element('#auto-resize').height() + 15);
                    });
                    
                    return requestData;
                }, function(reason) {
                    notificationService.sendError(reason.message, 5000, null, true);
                    if ($location.path() !== '/dashboard') {
                        $location.path('/dashboard').search({});
                    }
                });
            };

            var loadTopicOptions = function(){
                return crsJiraService.getTopicOptions().then(function(topicOptions){
                    vm.topicOptions = topicOptions;
                    topicOptions.sort(function(a, b) {
                        return utilsService.compareStrings(a.value, b.value);
                    });
                    requestService.setTopics(vm.topicOptions);
                });
            };

            var pushOtherTopic = function(value){
                if(vm.topicOptions){
                    var tmp = [];
                    for(var i in vm.topicOptions){
                        tmp.push(vm.topicOptions[i].value);
                    }
                    if(tmp.indexOf(value) === -1) {
                        var obj = {};
                        obj.value = value;
                        vm.topicOptions.push(obj);
                    }
                }
            };

            var loadRequestMetadata = function() {
                requestMetadataService.getMetadata([
                        REQUEST_METADATA_KEY.RELATIONSHIP_TYPE,
                        REQUEST_METADATA_KEY.CHARACTERISTIC_TYPE,
                        REQUEST_METADATA_KEY.REFINABILITY,
                        REQUEST_METADATA_KEY.NEW_CONCEPT_STATUS,
                        REQUEST_METADATA_KEY.CASE_SIGNIFICANCE,
                        REQUEST_METADATA_KEY.CONCEPT_HISTORY_ATTRIBUTE,
                        REQUEST_METADATA_KEY.NEW_DESCRIPTION_STATUS,
                        REQUEST_METADATA_KEY.NEW_RELATIONSHIP_STATUS
                    ])
                    .then(function(metadata) {
                        vm.relationshipTypes = metadata[REQUEST_METADATA_KEY.RELATIONSHIP_TYPE];
                        vm.characteristicTypes = metadata[REQUEST_METADATA_KEY.CHARACTERISTIC_TYPE];
                        vm.refinabilities = metadata[REQUEST_METADATA_KEY.REFINABILITY];
                        vm.newConceptStatuses = metadata[REQUEST_METADATA_KEY.NEW_CONCEPT_STATUS];
                        vm.caseSignificances = metadata[REQUEST_METADATA_KEY.CASE_SIGNIFICANCE];
                        vm.historyAttributes = metadata[REQUEST_METADATA_KEY.CONCEPT_HISTORY_ATTRIBUTE];
                        vm.descriptionStatuses = metadata[REQUEST_METADATA_KEY.NEW_DESCRIPTION_STATUS];
                        vm.relationshipStatuses = metadata[REQUEST_METADATA_KEY.NEW_RELATIONSHIP_STATUS];
                    });
            };

            var cancelEditing = function() {
                goBackToPreviousList();
            };

            var identifyParentConcept = function(concept) {
                var relationship, parentConcept = null;

                if (concept &&
                    angular.isArray(concept.relationships) &&
                    concept.relationships.length > 0) {

                    for (var i = 0; i < concept.relationships.length; i++) {
                        relationship = concept.relationships[i];

                        if (relationship.active === true &&
                            snowowlMetadataService.isIsaRelationship(relationship.type.conceptId)) {
                            parentConcept = {
                                id: (relationship.target && relationship.target.conceptId) ? relationship.target.conceptId : null,
                                fsn: (relationship.target && relationship.target.fsn) ? relationship.target.fsn : null
                            };

                            break;
                        }
                    }
                }

                return parentConcept;
            };

            var injectParentConcept = function(concept, parentConcept) {
                var isaRelationship = objectService.getNewIsaRelationship(concept.conceptId);

                if (!angular.isArray(concept.relationships)) {
                    concept.relationships = [];
                }
                if (vm.requestType === REQUEST_TYPE.NEW_CONCEPT) {
                    var arr = [];
                    for (var i = 0; i < parentConcept.length; i++) {
                        var obj = angular.copy(isaRelationship);
                        obj.target.conceptId = parentConcept[i].conceptId;
                        obj.target.fsn = parentConcept[i].fsn;
                        arr.push(obj);
                    }
                    concept.relationships = concept.relationships.concat(arr);
                } else {
                    isaRelationship.target = parentConcept;
                    concept.relationships.push(isaRelationship);
                }
            };

            var injectRelationship = function(concept, relationshipType, destinationConcept, characteristicType, refinability, applyChanges) {
                var relationship = objectService.getNewAttributeRelationship(concept.conceptId);
                if (!angular.isArray(concept.relationships)) {
                    concept.relationships = [];
                }

                relationship.type = relationshipType;
                relationship.target = {
                    active: destinationConcept.active,
                    conceptId: destinationConcept.conceptId,
                    definitionStatus: destinationConcept.definitionStatus,
                    effectiveTime: destinationConcept.effectiveTime,
                    fsn: destinationConcept.fsn,
                    moduleId: destinationConcept.moduleId
                };

                if (applyChanges) {
                    relationship.definitionOfChanges = {
                        changeId: null,
                        changeType: REQUEST_TYPE.NEW_RELATIONSHIP.value,
                        changed: true,
                        characteristicType: characteristicType,
                        refinability: refinability
                    };
                }

                concept.relationships.push(relationship);
            };

            var extractConceptDescriptions = function(concept, descriptionType, extractAll) {
                var description, descriptions = [];
				
                if (concept &&
                    angular.isArray(concept.descriptions) &&
                    concept.descriptions.length > 0) {
                    for (var i = 0; i < concept.descriptions.length; i++) {
                        description = concept.descriptions[i];

                        if (description.type === descriptionType &&
                            (extractAll || description.definitionOfChanges) && // extract all or only changes descriptions
                            description.active === true) {
                            descriptions.push(description);
                        }
                    }
                }

                return descriptions;
            };

            var injectConceptDescription = function(concept, descriptionTerm, applyChanges) {
                var desc = objectService.getNewDescription(concept.conceptId);
                desc.term = descriptionTerm;
                if (!angular.isArray(concept.descriptions)) {
                    concept.descriptions = [];
                }

                if (applyChanges) {
                    desc.definitionOfChanges = {
                        changeId: null,
                        changeType: REQUEST_TYPE.NEW_DESCRIPTION.value,
                        changed: true
                    };
                }

                concept.descriptions.push(desc);
            };

            var cloneConceptRelationship = function(concept, sourceRelationshipId, proposedRefinability, proposedRelationshipStatus, applyChanges, destinationConcept, characteristicType, relationshipType, groupId) {
                var sourceRelationship, newRelaionship, sourceRel;
                for (var i = 0; i < concept.relationships.length; i++) {
                    sourceRel = concept.relationships[i];

                    if (sourceRel.relationshipId === sourceRelationshipId) {
                        sourceRelationship = sourceRel;
                        break;
                    }
                }

                if (sourceRelationship) {
                    newRelaionship = angular.copy(sourceRelationship);

                    // if (destinationConcept) {
                        newRelaionship.target = {
                            active: destinationConcept? destinationConcept.active: concept.active,
                            conceptId: destinationConcept? destinationConcept.conceptId: concept.conceptId ,
                            definitionStatus: destinationConcept? destinationConcept.definitionStatus: concept.definitionStatus,
                            effectiveTime: destinationConcept? destinationConcept.effectiveTime: concept.effectiveTime,
                            fsn: destinationConcept? destinationConcept.fsn: concept.fsn,
                            moduleId: destinationConcept? destinationConcept.moduleId: concept.moduleId
                        };
                    // }

                    if (relationshipType) {
                        newRelaionship.type = relationshipType;
                    }

                    if (groupId) {
                        newRelaionship.groupId = groupId;
                    }

                    newRelaionship.relationshipId = null;
                    newRelaionship.effectiveTime = null;

                    if (proposedRefinability !== undefined &&
                        proposedRefinability !== null &&
                        proposedRefinability.trim() !== '') {
                        newRelaionship.refinability = proposedRefinability;
                    }

                    if (proposedRelationshipStatus) {
                        newRelaionship.relationshipStatus = proposedRelationshipStatus;
                    }

                    if (applyChanges) {
                        newRelaionship.definitionOfChanges = {
                            changeId: null,
                            changeType: REQUEST_TYPE.NEW_RELATIONSHIP.value,
                            changed: true
                        };
                    }

                    if (!angular.isArray(concept.relationships)) {
                        concept.relationships = [];
                    } else if (applyChanges) {
                        sourceRelationship.active = false;
                        sourceRelationship.definitionOfChanges = {
                            changeId: null,
                            changeType: REQUEST_TYPE.CHANGE_RELATIONSHIP.value,
                            changed: true,
                            relationshipStatus: proposedRelationshipStatus,
                            refinability: proposedRefinability,
                            characteristicType: characteristicType,
                            relationshipGroup: groupId,
                        };
                    }

                    concept.relationships.push(newRelaionship);
                }
            };

            var cloneConceptDescription = function(concept, sourceDescriptionId, proposedTerm, proposedCaseSignificance, applyChanges, descriptionStatus) {
                var sourceDescription, newDesc, sourceDesc;
                for (var i = 0; i < concept.descriptions.length; i++) {
                    sourceDesc = concept.descriptions[i];

                    if (sourceDesc.descriptionId === sourceDescriptionId) {
                        sourceDescription = sourceDesc;
                        break;
                    }
                }

                if (sourceDescription) {
					
                    newDesc = angular.copy(sourceDescription);

                    newDesc.descriptionId = null;
                    newDesc.effectiveTime = null;

                    if (proposedTerm !== undefined &&
                        proposedTerm !== null &&
                        proposedTerm.trim() !== '') {
                        newDesc.term = proposedTerm;
                    }

                    if (proposedCaseSignificance) {
                        newDesc.caseSignificance = proposedCaseSignificance;
                    }

                    if (applyChanges && vm.requestType !== REQUEST_TYPE.RETIRE_DESCRIPTION) {
                        newDesc.definitionOfChanges = {
                            changeId: null,
                            changeType: REQUEST_TYPE.NEW_DESCRIPTION.value,
                            changed: true
                        };
                    }

                    if (!angular.isArray(concept.descriptions)) {
                        concept.descriptions = [];
                    } else if (applyChanges && vm.requestType !== REQUEST_TYPE.RETIRE_DESCRIPTION) {
                        sourceDescription.active = false;
                        sourceDescription.definitionOfChanges = {
                            changeId: null,
                            changeType: REQUEST_TYPE.CHANGE_DESCRIPTION.value,
                            changed: true,
                            descriptionStatus: descriptionStatus,
                            proposedDescription: proposedTerm,
                            proposedCaseSignificance: proposedCaseSignificance
                        };
                    } else if (vm.requestType === REQUEST_TYPE.RETIRE_DESCRIPTION) {
                        sourceDescription.active = false;
                        sourceDescription.definitionOfChanges = {
                            changeId: null,
                            changeType: REQUEST_TYPE.RETIRE_DESCRIPTION.value,
                            changed: true,
                            descriptionStatus: descriptionStatus,
                            proposedDescription: proposedTerm,
                            proposedCaseSignificance: proposedCaseSignificance
                        };
                    }
                    if (vm.requestType !== REQUEST_TYPE.RETIRE_DESCRIPTION) {
                        concept.descriptions.push(newDesc);
                    }
                }
            };

            var extractConceptFSN = function(concept) {
                var fsns = extractConceptDescriptions(concept, DESCRIPTION_TYPE.FSN, true);

                if (fsns.length > 0) {
                    return fsns[0].term;
                }

                return null;
            };

            var injectConceptFSN = function(concept, fsn, applyChanges) {
                var fsnDesc = objectService.getNewFsn(concept.conceptId);
                var currentFsns, currentFsn;

                if (!angular.isArray(concept.descriptions)) {
                    concept.descriptions = [];
                } else if (applyChanges) {
                    // de-active current fsn
                    currentFsns = extractConceptDescriptions(concept, DESCRIPTION_TYPE.FSN, true);

                    if (currentFsns.length > 0) {
                        currentFsn = currentFsns[0];
                        currentFsn.active = false;
                        currentFsn.definitionOfChanges = {
                            changeId: null,
                            changeType: REQUEST_TYPE.CHANGE_DESCRIPTION.value,
                            changed: true,
                            descriptionStatus: 'Retired'
                        };
                    }
                }

                fsnDesc.term = fsn;
                if (applyChanges) {
                    fsnDesc.definitionOfChanges = {
                        changeId: null,
                        changeType: REQUEST_TYPE.NEW_DESCRIPTION.value,
                        changed: true
                    };
                }

                concept.descriptions.push(fsnDesc);
                return null;
            };

            var extractConceptPT = function(concept) {
                var syns = extractConceptDescriptions(concept, DESCRIPTION_TYPE.SYN, true);
                for (var i = 0; i < syns.length; i++) {
                    if (syns[i].acceptabilityMap &&
                        syns[i].acceptabilityMap[ACCEPTABILITY_DIALECT.EN_GB] === ACCEPTABILITY_VALUE.PREFERRED &&
                        syns[i].acceptabilityMap[ACCEPTABILITY_DIALECT.EN_US] === ACCEPTABILITY_VALUE.PREFERRED) {
                        return syns[i].term;
                    }
                }

                return null;
            };

            var injectConceptPT = function(concept, conceptPT, applyChanges) {
                var preferredTerm = objectService.getNewPt(concept.conceptId);
                if (!angular.isArray(concept.descriptions)) {
                    concept.descriptions = [];
                }

                preferredTerm.term = conceptPT;

                if (applyChanges) {
                    preferredTerm.definitionOfChanges = {
                        changeId: null,
                        changeType: REQUEST_TYPE.NEW_DESCRIPTION.value,
                        changed: true
                    };
                }

                concept.descriptions.push(preferredTerm);

                return null;
            };

            var extractConceptSynonyms = function(concept, excludePT, extractAll) {
                var syns = extractConceptDescriptions(concept, DESCRIPTION_TYPE.SYN, extractAll);
                var sysnTerms = [];
                var excludedPT;
                for (var i = 0; i < syns.length; i++) {
                    if (!excludedPT &&
                        syns[i].acceptabilityMap &&
                        syns[i].acceptabilityMap[ACCEPTABILITY_DIALECT.EN_GB] === ACCEPTABILITY_VALUE.PREFERRED &&
                        syns[i].acceptabilityMap[ACCEPTABILITY_DIALECT.EN_US] === ACCEPTABILITY_VALUE.PREFERRED) {
                        excludedPT = syns[i];
                    }

                    if (!excludePT || syns[i] !== excludedPT) {
                        sysnTerms.push(syns[i].term);
                    }
                }

                return sysnTerms;
            };

            var injectConceptSynonyms = function(concept, synonyms, applyChanges) {
                var synTerm, synDesc;

                if (!angular.isArray(concept.descriptions)) {
                    concept.descriptions = [];
                }
                if (angular.isArray(synonyms) && synonyms.length > 0) {
                    for (var i = 0; i < synonyms.length; i++) {
                        synTerm = synonyms[i];

                        if (synTerm && synTerm.trim()) {
                            synDesc = objectService.getNewDescription(concept.conceptId);
                            synDesc.term = synTerm;
                            if (applyChanges) {
                                synDesc.definitionOfChanges = {
                                    changeId: null,
                                    changeType: REQUEST_TYPE.NEW_DESCRIPTION.value,
                                    changed: true
                                };
                            }
                            concept.descriptions.push(synDesc);
                        }
                    }
                }
            };

            var extractItemByRequestType = function(requestItems, type) {
                for (var i = 0; i < requestItems.length; i++) {
                    if (requestItems[i].requestType === type.value) {
                        return requestItems[i];
                    }
                }

                return null;
            };

            var extractConceptDefinitions = function(concept, extractAll) {
                var defs = extractConceptDescriptions(concept, DESCRIPTION_TYPE.DEF, extractAll);
                var defTerms = [];
                for (var i = 0; i < defs.length; i++) {
                    defTerms.push(defs[i].term);
                }

                return defTerms;
            };

            var injectConceptDefinitions = function(concept, definitions, applyChanges) {
                var defTerm, defDesc;
                if (!angular.isArray(concept.descriptions)) {
                    concept.descriptions = [];
                }

                if (angular.isArray(definitions) && definitions.length > 0) {
                    for (var i = 0; i < definitions.length; i++) {
                        defTerm = definitions[i];

                        if (defTerm && defTerm.trim()) {
                            defDesc = objectService.getNewTextDefinition(concept.conceptId);
                            defDesc.term = defTerm;
                            if (applyChanges) {
                                defDesc.definitionOfChanges = {
                                    changeId: null,
                                    changeType: REQUEST_TYPE.NEW_DESCRIPTION.value,
                                    changed: true
                                };
                            }
                            concept.descriptions.push(defDesc);
                        }
                    }
                }
            };

            var buildRequestWorkItem = function(concept, definitionOfChanges, changedTarget, request) {

                var item = {};
                var parentConcept, isDescriptionPT = false;

                item.requestType = definitionOfChanges.changeType;
                item.id = definitionOfChanges.changeId;
                item.topic = concept.definitionOfChanges.topic;
                item.summary = concept.definitionOfChanges.summary;
                item.reasonForChange = concept.definitionOfChanges.reasonForChange;
                item.notes = concept.definitionOfChanges.notes;
                item.reference = concept.definitionOfChanges.reference;
                item.namespace = concept.definitionOfChanges.namespace;

                switch (item.requestType) {
                    case REQUEST_TYPE.NEW_CONCEPT.value:
                        parentConcept = identifyParentConcept(concept);
                        // item.parentId = (parentConcept) ? parentConcept.id : null;
                        // item.parentFSN = (parentConcept) ? parentConcept.fsn : null;
                        item.proposedFSN = concept.fsn;
                        item.conceptPT = extractConceptPT(concept);
                        item.proposedSynonyms = extractConceptSynonyms(concept, item.conceptPT, true);
                        item.proposedDefinitions = extractConceptDefinitions(concept, true);
                        item.proposedParents = [];
                        item.requestorInternalTerm = changedTarget.requestorInternalTerm;
                        item.proposedUse = changedTarget.proposedUse;
                        item.requestDescription = changedTarget.requestDescription;
                        item.umlsCui = changedTarget.umlsCui;
                        if (changedTarget.parentConcept) {
                            for (var i = 0; i < changedTarget.parentConcept.length; i++) {
                                var obj = {};
                                obj.conceptId = changedTarget.parentConcept[i].conceptId;
                                obj.fsn = changedTarget.parentConcept[i].fsn;
                                obj.sourceTerminology = changedTarget.parentConcept[i].sourceTerminology;
                                obj.refType = 'EXISTING';
                                item.proposedParents.push(obj);
                            }
                        }else if(concept && vm.inputMode === REQUEST_INPUT_MODE.DIRECT){
                            for(var j in concept.relationships){
                                if(concept.relationships[j].type.conceptId === "116680003"){
                                    if(concept.relationships[j].target.conceptId !== null){
                                        var tmpObj = {};
                                        tmpObj.conceptId = concept.relationships[j].target.conceptId;
                                        tmpObj.fsn = concept.relationships[j].target.fsn;
                                        tmpObj.refType = 'EXISTING';
                                        item.proposedParents.push(tmpObj); 
                                    }
                                }
                            }
                        }
                        if((definitionOfChanges.value === null || definitionOfChanges.value === undefined) && definitionOfChanges.currentFsn !== null){
                            var semanticTag;
                            var start = definitionOfChanges.currentFsn.indexOf("(");
                            var end = definitionOfChanges.currentFsn.indexOf(")");
                            semanticTag = definitionOfChanges.currentFsn.substring(start + 1, end);
                            item.semanticTag = semanticTag;
                        }else{
                            item.semanticTag = changedTarget.value;
                        }

                        break;

                    case REQUEST_TYPE.CHANGE_RETIRE_CONCEPT.value:
                        item.conceptId = concept.conceptId;
                        item.conceptFSN = concept.definitionOfChanges.currentFsn;
                        item.proposedFSN = concept.fsn;
                        item.proposedStatus = definitionOfChanges.proposedStatus;
                        item.historyAttribute = definitionOfChanges.historyAttribute;
                        item.historyAttributeValue = definitionOfChanges.historyAttributeValue;
                        item.sourceTerminology = changedTarget.sourceTerminology;
                        item.destinationTerminology = changedTarget.destinationTerminology;
                        item.duplicatedConceptId = vm.duplicateConcept.conceptId;
                        break;

                    case REQUEST_TYPE.NEW_DESCRIPTION.value:
                        if (changedTarget.type === DESCRIPTION_TYPE.SYN &&
                            changedTarget.acceptabilityMap &&
                            changedTarget.acceptabilityMap[ACCEPTABILITY_DIALECT.EN_GB] === ACCEPTABILITY_VALUE.PREFERRED &&
                            changedTarget.acceptabilityMap[ACCEPTABILITY_DIALECT.EN_US] === ACCEPTABILITY_VALUE.PREFERRED) {
                            isDescriptionPT = true;
                        }

                        item.conceptId = concept.conceptId;
                        item.conceptFSN = concept.fsn;
                        item.proposedDescription = changedTarget.term;
                        item.descriptionIsPT = isDescriptionPT;
                        item.proposedCaseSignificance = request.proposedCaseSignificance;
                        item.sourceTerminology = request.sourceTerminology;
                        item.destinationTerminology = request.destinationTerminology;
                        break;

                    case REQUEST_TYPE.CHANGE_DESCRIPTION.value:
                        item.conceptId = concept.conceptId;
                        item.conceptFSN = concept.fsn;
                        item.descriptionId = changedTarget.descriptionId;
                        item.currentDescription = changedTarget.term;
                        item.conceptDescription = changedTarget.term;
                        item.proposedDescription = definitionOfChanges.proposedDescription || changedTarget.term;
                        item.proposedCaseSignificance = definitionOfChanges.proposedCaseSignificance;
                        item.sourceTerminology = request.sourceTerminology;
                        item.destinationTerminology = request.destinationTerminology;
                        item.proposedDescriptionStatus = 'Retired';
                        break;

                    case REQUEST_TYPE.RETIRE_DESCRIPTION.value:
                        item.conceptId = concept.conceptId;
                        item.conceptFSN = concept.fsn;
                        item.descriptionId = changedTarget.descriptionId;
                        item.currentDescription = changedTarget.term;
                        item.conceptDescription = changedTarget.term;
                        item.proposedDescription = definitionOfChanges.proposedDescription || changedTarget.term;
                        item.proposedCaseSignificance = definitionOfChanges.proposedCaseSignificance;
                        item.proposedDescriptionStatus = definitionOfChanges.descriptionStatus;
                        item.sourceTerminology = request.sourceTerminology;
                        item.destinationTerminology = request.destinationTerminology;
                        break;

                    case REQUEST_TYPE.NEW_RELATIONSHIP.value:
                        item.conceptId = concept.conceptId;
                        item.relationshipType = changedTarget.type.conceptId;
                        item.destConceptId = changedTarget.target.conceptId;
                        item.characteristicType = definitionOfChanges.characteristicType;
                        item.refinability = definitionOfChanges.refinability;
                        item.sourceTerminology = request.sourceTerminology;
                        item.destinationTerminology = request.destinationTerminology;
                        break;

                    case REQUEST_TYPE.RETIRE_RELATIONSHIP.value:
                        item.conceptId = concept.conceptId;
                        item.conceptFSN = concept.fsn;
                        item.relationshipId = changedTarget.relationshipId;
                        item.refinability = definitionOfChanges.refinability;
                        item.relationshipStatus = definitionOfChanges.relationshipStatus;
                        item.relationshipCharacteristicType = changedTarget.characteristicType;
                        item.sourceTerminology = request.sourceTerminology;
                        item.destinationTerminology = request.destinationTerminology;
                        break;

                    case REQUEST_TYPE.CHANGE_RELATIONSHIP.value:
                        item.conceptId = concept.conceptId;
                        item.conceptFSN = concept.fsn;
                        item.relationshipType = changedTarget.type.conceptId;
                        item.destConceptId = (request.destinationConcept) ? request.destinationConcept.conceptId : concept.conceptId;
                        item.relationshipId = changedTarget.relationshipId;
                        item.refinability = definitionOfChanges.refinability;
                        item.relationshipStatus = 'Retired';
                        item.characteristicType = definitionOfChanges.characteristicType;
                        item.relationshipGroup = definitionOfChanges.relationshipGroup;
                        item.relationshipCharacteristicType = changedTarget.characteristicType;
                        item.sourceTerminology = request.sourceTerminology;
                        item.destinationTerminology = request.destinationTerminology;
                        break;
                }

                return item;

            };

            var buildRequestFromRequestData = function(requestData) {
                var request = {
                    id: requestData.id,
                    requestorInternalId: requestData.requestorInternalId,
                    fsn: requestData.fsn,
                    batchRequest: requestData.batchRequest,
                    rfcNumber: requestData.rfcNumber,
                    additionalFields: requestData.additionalFields || {},
                    jiraTicketId: requestData.jiraTicketId,
                    requestType: requestData.requestType,
                    inputMode: requestData.inputMode,
                    requestHeader: requestData.requestHeader,
                    contentTrackerUrl: requestData.contentTrackerUrl,
                    authoringTaskTicket: requestData.authoringTaskTicket,
                    trackerId: requestData.trackerId,
                    impactedConceptId: requestData.impactedConceptId,
                    newFSN: requestData.newFSN
                };
                $rootScope.newConceptRequestType = requestData.requestType;
                var requestItems = requestData.requestItems;
                var mainItem = extractItemByRequestType(requestItems, requestService.identifyRequestType(request.requestType));

                //display topic which is not in jira's topics
                $timeout(function(){
                    pushOtherTopic(mainItem.topic);
                }, 2000);
                
                switch (request.requestType) {
                    case REQUEST_TYPE.NEW_CONCEPT.value:
                        //mainItem = requestItems[0];

                        //parentConcept = identifyParentConcept(concept);
                        // request.parentConcept = {
                        //     conceptId: mainItem.parentId,
                        //     fsn: mainItem.parentFSN
                        // };
                        request.parentConcept = [];
                        for (var i in requestData.requestItems[0].proposedParents) {
                            var obj = {};
                            obj = requestData.requestItems[0].proposedParents[i];
                            request.parentConcept.push(obj);
                        }

                        request.proposedFSN = mainItem.proposedFSN;
                        request.conceptPT = mainItem.conceptPT;
                        request.proposedSynonyms = mainItem.proposedSynonyms;
                        request.proposedDefinitions = mainItem.proposedDefinitions;
                        request.proposedUse = mainItem.proposedUse;
                        request.requestorInternalTerm = mainItem.requestorInternalTerm;
                        request.value = mainItem.semanticTag;
                        request.localCode = requestData.localCode;
                        request.umlsCui = mainItem.umlsCui;
                        request.requestDescription = mainItem.requestDescription;
                        autoFillPreferredTerm = false;
                        $timeout(function(){
                            pushOtherSemanticTag(request.value);
                        }, 1000);
                        break;

                    case REQUEST_TYPE.CHANGE_RETIRE_CONCEPT.value:
                        //mainItem = extractItemByRequestType(requestItems, REQUEST_TYPE.CHANGE_RETIRE_CONCEPT);

                        request.proposedFSN = mainItem.proposedFSN;
                        request.proposedStatus = mainItem.proposedStatus;
                        request.historyAttribute = mainItem.historyAttribute;
                        request.historyAttributeValue = mainItem.historyAttributeValue;
                        request.sourceTerminology = mainItem.sourceTerminology;
                        request.destinationTerminology = mainItem.destinationTerminology;

                        // load duplicate concept
                        snowowlService.getFullConcept(null, null, mainItem.duplicatedConceptId).then(function(response) {
                            vm.duplicateConcept = response;
                        });

                        if(!vm.duplicateConcept.conceptId || !vm.duplicateConcept.fsn){
                            vm.duplicateConcept = {
                                conceptId: mainItem.duplicatedConceptId,
                                fsn: mainItem.duplicatedConceptId
                            };
                        }
                        break;

                    case REQUEST_TYPE.NEW_DESCRIPTION.value:
                        //mainItem = extractItemByRequestType(requestItems, REQUEST_TYPE.NEW_DESCRIPTION);

                        request.proposedDescription = mainItem.proposedDescription;
                        request.descriptionIsPT = mainItem.descriptionIsPT;
                        request.sourceTerminology = mainItem.sourceTerminology;
                        request.destinationTerminology = mainItem.destinationTerminology;
                        request.proposedCaseSignificance = mainItem.proposedCaseSignificance;
                        break;

                    case REQUEST_TYPE.CHANGE_DESCRIPTION.value:
                        //mainItem = extractItemByRequestType(requestItems, REQUEST_TYPE.CHANGE_DESCRIPTION);

                        request.descriptionId = mainItem.descriptionId;
                        request.proposedDescription = mainItem.proposedDescription;
                        request.proposedCaseSignificance = mainItem.proposedCaseSignificance;
                        request.descriptionStatus = mainItem.proposedDescriptionStatus;
                        request.sourceTerminology = mainItem.sourceTerminology;
                        request.destinationTerminology = mainItem.destinationTerminology;
                        break;

                    case REQUEST_TYPE.RETIRE_DESCRIPTION.value:
                        //mainItem = extractItemByRequestType(requestItems, REQUEST_TYPE.CHANGE_DESCRIPTION);

                        request.descriptionId = mainItem.descriptionId;
                        request.proposedDescription = mainItem.proposedDescription;
                        request.proposedCaseSignificance = mainItem.proposedCaseSignificance;
                        request.descriptionStatus = mainItem.proposedDescriptionStatus;
                        request.sourceTerminology = mainItem.sourceTerminology;
                        request.destinationTerminology = mainItem.destinationTerminology;
                        break;

                    case REQUEST_TYPE.NEW_RELATIONSHIP.value:
                        //mainItem = extractItemByRequestType(requestItems, REQUEST_TYPE.NEW_RELATIONSHIP);

                        request.characteristicType = mainItem.characteristicType;
                        request.refinability = mainItem.refinability;
                        request.sourceTerminology = mainItem.sourceTerminology;
                        request.destinationTerminology = mainItem.destinationTerminology;
                        $rootScope.desTerminilogy = mainItem.destinationTerminology;

                        // load destination concept
                        request.destinationConcept = {
                            conceptId: mainItem.destConceptId
                        };

                        // load relationship type
                        snowowlService.getFullConcept(null, null, mainItem.relationshipType).then(function(response) {
                            request.relationshipType = {
                                conceptId: mainItem.relationshipType,
                                fsn: response.fsn
                            };
                        });

                        break;

                    case REQUEST_TYPE.RETIRE_RELATIONSHIP.value:
                        //mainItem = extractItemByRequestType(requestItems, REQUEST_TYPE.RETIRE_RELATIONSHIP);

                        request.relationshipId = mainItem.relationshipId;
                        request.relationshipStatus = mainItem.relationshipStatus;
                        request.refinability = mainItem.refinability;
                        request.characteristicType = mainItem.characteristicType;
                        request.relationshipCharacteristicType = mainItem.relationshipCharacteristicType;
                        request.sourceTerminology = mainItem.sourceTerminology;
                        request.destinationTerminology = mainItem.destinationTerminology;

                        break;

                    case REQUEST_TYPE.CHANGE_RELATIONSHIP.value:
                        //mainItem = extractItemByRequestType(requestItems, REQUEST_TYPE.RETIRE_RELATIONSHIP);

                        request.relationshipId = mainItem.relationshipId;
                        request.relationshipStatus = mainItem.relationshipStatus;
                        request.refinability = mainItem.refinability;
                        request.characteristicType = mainItem.characteristicType;
                        request.groupId = mainItem.relationshipGroup;
                        request.relationshipCharacteristicType = mainItem.relationshipCharacteristicType;
                        request.sourceTerminology = mainItem.sourceTerminology;
                        request.destinationTerminology = mainItem.destinationTerminology;
                        $rootScope.desTerminilogy = mainItem.destinationTerminology;

                        // load destination concept
                        request.destinationConcept = {
                            conceptId: mainItem.destConceptId
                        };

                        // load relationship type
                        snowowlService.getFullConcept(null, null, mainItem.relationshipType).then(function(response) {
                            request.relationshipType = {
                                conceptId: mainItem.relationshipType,
                                fsn: response.fsn
                            };
                        });

                        break;

                    case REQUEST_TYPE.OTHER.value:
                        //mainItem = extractItemByRequestType(requestItems, REQUEST_TYPE.RETIRE_RELATIONSHIP);
                        request.requestDescription = mainItem.requestDescription;

                        break;
                }

                return request;

            };

            var buildOtherRequestWorkItem = function(request) {
                var item = {};
                if (request.definitionOfChanges) {
                    item.requestDescription = request.requestDescription;
                    item.requestType = request.definitionOfChanges.changeType;
                    item.id = request.definitionOfChanges.changeId;
                    item.topic = request.additionalFields.topic;
                    item.summary = request.additionalFields.summary;
                    item.notes = request.additionalFields.notes;
                    item.reference = request.additionalFields.reference;
                    item.reasonForChange = request.additionalFields.reasonForChange;
                    item.namespace = request.additionalFields.namespace;
                }
                return item;
            };

            var buildRequestData = function(request, concept) {
                var requestDetails = {};


                requestDetails.inputMode = vm.inputMode.value;
                requestDetails.requestType = vm.requestType.value;

                requestDetails.id = request.id;
                requestDetails.requestorInternalId = request.requestorInternalId;
                requestDetails.localCode = request.localCode;
                requestDetails.requestItems = [];
                requestDetails.concept = concept;

                //buildRequestAdditionalFields(requestDetails, concept);
                requestDetails.additionalFields = request.additionalFields;

                if (vm.requestType === REQUEST_TYPE.OTHER) {
                    requestDetails.requestItems.push(buildOtherRequestWorkItem(request));
                    return requestDetails;
                }

                requestDetails.fsn = concept.fsn;

                // check concept changes
                if (concept.definitionOfChanges && concept.definitionOfChanges.changed === true) {
                    requestDetails.requestItems.push(buildRequestWorkItem(concept, concept.definitionOfChanges, request));
                }

                if (concept.definitionOfChanges.changeType === REQUEST_TYPE.CHANGE_RETIRE_CONCEPT.value) {
                    angular.forEach(concept.descriptions, function(description) {

                        if (description.definitionOfChanges && description.definitionOfChanges.changed) {
                            requestDetails.requestItems.push(buildRequestWorkItem(concept, description.definitionOfChanges, description, request));
                        }
                    });

                    angular.forEach(concept.relationships, function(relationship) {
                        if (relationship.definitionOfChanges && relationship.definitionOfChanges.changed) {
                            requestDetails.requestItems.push(buildRequestWorkItem(concept, relationship.definitionOfChanges, relationship, request));
                        }
                    });
                }

                return requestDetails;
            };

            var buildConceptDefinitionOfChange = function(concept, request) {
                if (!concept.definitionOfChanges) {
                    concept.definitionOfChanges = buildChangeConceptDefinitionOfChanges();
                }

                if (!concept.conceptId) {
                    concept.fsn = extractConceptFSN(concept);
                }

                // build concept additional fields
                concept.definitionOfChanges.topic = request.additionalFields.topic;
                concept.definitionOfChanges.summary = request.additionalFields.summary;
                // concept.definitionOfChanges.localTerm = request.localTerm;
                // concept.definitionOfChanges.proposedUse = request.proposedUse;
                concept.definitionOfChanges.notes = request.additionalFields.notes;
                concept.definitionOfChanges.reference = request.additionalFields.reference;
                concept.definitionOfChanges.reasonForChange = request.additionalFields.reasonForChange;
                concept.definitionOfChanges.namespace = request.additionalFields.namespace;
                concept.definitionOfChanges.currentFsn = concept.fsn;
				if(null !== request.requestorInternalId && '' !== request.requestorInternalId && REQUEST_TYPE.NEW_CONCEPT.value === request.requestType){
					concept.conceptId = request.requestorInternalId;
				}
            };

            var buildConceptFromRequest = function(request) {
                var concept = null,
                    parentConcept;
                if (vm.originalConcept) {
                    concept = angular.copy(vm.originalConcept);
                    if (requestType === REQUEST_TYPE.CHANGE_RETIRE_CONCEPT) {
                        concept.fsn = '';
                    }

                    // build definition of changes
                    buildConceptDefinitionOfChange(concept, request);

                    // apply changes from request to concept
                    switch (vm.requestType) {
                        case REQUEST_TYPE.NEW_CONCEPT:
                            concept.descriptions = [];
                            concept.relationships = [];
                            concept.fsn = request.proposedFSN;

                            if (!request.parentConcept) {
                                parentConcept = {
                                    conceptId: null,
                                    fsn: null
                                };
                            } else {
                                parentConcept = request.parentConcept;
                            }

                            injectParentConcept(concept, parentConcept);

                            injectConceptFSN(concept, request.proposedFSN, false);
                            injectConceptPT(concept, request.conceptPT, false);

                            injectConceptSynonyms(concept, request.proposedSynonyms, false);
                            injectConceptDefinitions(concept, request.proposedDefinitions, false);
                            break;

                        case REQUEST_TYPE.CHANGE_RETIRE_CONCEPT:
                            concept.definitionOfChanges.changed = true;
                            concept.definitionOfChanges.proposedStatus = request.proposedStatus;
                            concept.definitionOfChanges.historyAttribute = request.historyAttribute;
                            concept.definitionOfChanges.historyAttributeValue = request.historyAttributeValue;
                            //concept.definitionOfChanges.currentFsn = concept.fsn;

                            if (request.proposedFSN && request.proposedFSN !== concept.fsn) {
                                concept.fsn = request.proposedFSN;
                                injectConceptFSN(concept, request.proposedFSN, true);
                            }


                            break;

                        case REQUEST_TYPE.NEW_DESCRIPTION:
                            if (request.descriptionIsPT === true) {
                                injectConceptPT(concept, request.proposedDescription, true);
                            } else {
                                injectConceptDescription(concept, request.proposedDescription, true);
                            }
                            break;

                        case REQUEST_TYPE.CHANGE_DESCRIPTION:
                            cloneConceptDescription(concept, request.descriptionId, request.proposedDescription, request.proposedCaseSignificance, true, request.descriptionStatus);
                            break;

                        case REQUEST_TYPE.RETIRE_DESCRIPTION:
                            cloneConceptDescription(concept, request.descriptionId, request.proposedDescription, request.proposedCaseSignificance, true, request.descriptionStatus);
                            break;

                        case REQUEST_TYPE.NEW_RELATIONSHIP:
                            injectRelationship(concept, request.relationshipType, request.destinationConcept, request.characteristicType, request.refinability, true);
                            break;

                        case REQUEST_TYPE.RETIRE_RELATIONSHIP:
                            // collect selected relationships       
                            //vm.request.relationshipId = selectedRelationshipsOutput();

                            for (var i = 0; i < concept.relationships.length; i++) {
                                for (var j = 0; j < request.relationshipId.length; j++) {
                                    if (concept.relationships[i].relationshipId === request.relationshipId[j]) {
                                        concept.relationships[i].active = false;
                                        concept.relationships[i].definitionOfChanges = {
                                            changeId: null,
                                            changeType: REQUEST_TYPE.RETIRE_RELATIONSHIP.value,
                                            changed: true,
                                            relationshipStatus: request.relationshipStatus,
                                            refinability: request.refinability
                                        };
                                        break;
                                    }
                                }
                            }
                            break;

                        case REQUEST_TYPE.CHANGE_RELATIONSHIP:
                            cloneConceptRelationship(concept, request.relationshipId, request.refinability, 'Retired', true, request.destinationConcept, request.characteristicType, request.relationshipType, request.groupId);
                            break;
                    }
                }

                return concept;
            };

            var validateRequest = function(ignoreGeneralFields) {
                //vm.request.relationshipId = selectedRelationshipsOutput();
                var field, fieldValue, error = {};
                var fieldRequiredLangKey = 'crs.request.message.error.fieldRequired',
                    fieldInvalidLangKey = 'crs.request.message.error.fieldInvalid';

                notificationService.clear();

                // validate concept
                if (vm.requestType !== REQUEST_TYPE.OTHER) {
                    if (vm.originalConcept === undefined || vm.originalConcept === null ||
                        (vm.originalConcept && !vm.originalConcept.moduleId && !vm.originalConcept.conceptId && !vm.originalConcept.fsn)) {
                        error.concept = fieldRequiredLangKey;
                    } else if (vm.originalConcept && !vm.originalConcept.moduleId && !vm.originalConcept.conceptId && vm.originalConcept.fsn) {
                        error.concept = fieldInvalidLangKey;
                    }
                }

                // validate parent concept
                if (vm.requestType === REQUEST_TYPE.NEW_CONCEPT && vm.inputMode === REQUEST_INPUT_MODE.SIMPLE) {
                    if (vm.request.parentConcept[0].conceptId === undefined || vm.request.parentConcept[0].conceptId === null) {
                        error.parentConcept = fieldRequiredLangKey;
                    }
                }

                // test general fields
                if (!ignoreGeneralFields) {
                    if (!vm.request.additionalFields.topic ||
                        !vm.request.additionalFields.topic.trim()) {
                        error.topic = fieldRequiredLangKey;
                    }

                    if (!vm.request.additionalFields.reasonForChange ||
                        !vm.request.additionalFields.reasonForChange.trim()) {
                        error.reasonForChange = fieldRequiredLangKey;
                    }

                    if (!vm.request.additionalFields.summary ||
                        !vm.request.additionalFields.summary.trim()) {
                        error.summary = fieldRequiredLangKey;
                    }

                    if (!vm.request.additionalFields.reference ||
                        !vm.request.additionalFields.reference.trim()) {
                        error.reference = fieldRequiredLangKey;
                    }

                    // if ((!vm.request.proposedUse ||
                    //     !vm.request.proposedUse.trim()) && vm.requestType === REQUEST_TYPE.NEW_CONCEPT) {
                    //     error.proposedUse = fieldRequiredLangKey;
                    // }
                }

                var isNotValidObj = function() {
                    if (angular.isObject(fieldValue)) {
                        if (angular.isArray(fieldValue)) {
                            if (fieldValue.length === 0) {
                                return true;
                            }
                        } else if (!fieldValue.conceptId) {
                            return true;
                        }
                    }
                    return false;
                };

                // validate require fields
                if (vm.inputMode === REQUEST_INPUT_MODE.SIMPLE) {
                    for (var i = 0; i < vm.requestType.form.fields.length; i++) {
                        field = vm.requestType.form.fields[i];
                        fieldValue = vm.request[field.name];

                        if (field.required === true &&
                            (fieldValue === undefined ||
                                fieldValue === null ||
                                (angular.isFunction(fieldValue.trim) && fieldValue.trim() === '') ||
                                isNotValidObj(fieldValue))) {
                            error[field.name] = fieldRequiredLangKey;
                        }
                    }
                }

                vm.error = error;
                if (Object.keys(error).length > 0) {
                    notificationService.sendError('crs.request.message.error.invalidInput');
                    return false;
                }

                return true;
            };

            var selectedRelationshipsOutput = function() {
                var relIdArr = [];
                for (var key in vm.selectedRelationships) {
                    relIdArr.push(vm.selectedRelationships[key].relationshipId);
                }
                return relIdArr;
            };


            var saveRequest = function() {
                // vm.request.relationshipId = selectedRelationshipsOutput();
                // requestData
                var requestData;

                if (!validateRequest()) {
                    return;
                }

                notificationService.sendMessage('crs.request.message.requestSaving');

                // show loading mask
                $rootScope.showAppLoading = true;

                if (vm.inputMode === REQUEST_INPUT_MODE.SIMPLE) {
                    vm.concept = buildConceptFromRequest(vm.request);
                } else if (vm.inputMode === REQUEST_INPUT_MODE.DIRECT) {
                    buildConceptDefinitionOfChange(vm.concept, vm.request);
                }

                requestData = buildRequestData(vm.request, vm.concept);
                if (vm.requestType === REQUEST_TYPE.NEW_CONCEPT) {
                    for (var i in requestData.requestItems[0].proposedParents) {
                        if (requestData.requestItems[0].proposedParents[i].conceptId === undefined && requestData.requestItems[0].proposedParents[i].fsn === undefined) {
                            requestData.requestItems[0].proposedParents.splice(i, requestData.requestItems[0].proposedParents.length);
                        }
                    }
                }
                if (vm.inputMode !== REQUEST_INPUT_MODE.DIRECT) {
                    if (vm.requestType === REQUEST_TYPE.RETIRE_DESCRIPTION || vm.requestType === REQUEST_TYPE.RETIRE_RELATIONSHIP || vm.requestType === REQUEST_TYPE.CHANGE_DESCRIPTION || vm.requestType === REQUEST_TYPE.CHANGE_RELATIONSHIP || vm.requestType === REQUEST_TYPE.NEW_RELATIONSHIP || vm.requestType === REQUEST_TYPE.NEW_DESCRIPTION) {
                        for (var j in requestData.requestItems) {
                            if (requestData.requestItems[j].requestType === REQUEST_TYPE.CHANGE_RETIRE_CONCEPT.value) {
                                requestData.requestItems.splice(j, 1);
                            }
                            if (requestData.requestItems[j].requestType === REQUEST_TYPE.NEW_RELATIONSHIP.value && vm.requestType !== REQUEST_TYPE.NEW_RELATIONSHIP) {
                                requestData.requestItems.splice(j, 1);
                            }
                            if(vm.requestType === REQUEST_TYPE.RETIRE_DESCRIPTION){
                                if (requestData.requestItems[j].requestType === REQUEST_TYPE.NEW_DESCRIPTION.value) {
                                    requestData.requestItems.splice(j, 1);
                                }
                            }
                           
                        }
                    }
                }

                requestService.saveRequest(requestData)
                    .then(function(response) {
                        notificationService.sendMessage('crs.request.message.requestSaved', 5000);
                        $location.path('requests/preview/' + response.id).search({kb:true});
                    }, function(e) {
                        showErrorMessage(e.message);
                    })
                    .finally(function() {
                        $rootScope.showAppLoading = false;
                    });
            };

            var saveAndSubmitRequest = function() {
                // vm.request.relationshipId = selectedRelationshipsOutput();
                // requestData
                var requestData;

                if (!validateRequest()) {
                    return;
                }

                notificationService.sendMessage('crs.request.message.requestSubmitting');

                // show loading mask
                $rootScope.showAppLoading = true;

                if (vm.inputMode === REQUEST_INPUT_MODE.SIMPLE) {
                    vm.concept = buildConceptFromRequest(vm.request);
                } else if (vm.inputMode === REQUEST_INPUT_MODE.DIRECT) {
                    buildConceptDefinitionOfChange(vm.concept, vm.request);
                }

                requestData = buildRequestData(vm.request, vm.concept);
                if (vm.requestType === REQUEST_TYPE.NEW_CONCEPT) {
                    for (var i in requestData.requestItems[0].proposedParents) {
                        if (requestData.requestItems[0].proposedParents[i].conceptId === undefined && requestData.requestItems[0].proposedParents[i].fsn === undefined) {
                            requestData.requestItems[0].proposedParents.splice(i, requestData.requestItems[0].proposedParents.length);
                        }
                    }
                }
                if (vm.inputMode !== REQUEST_INPUT_MODE.DIRECT) {
                    if (vm.requestType === REQUEST_TYPE.RETIRE_DESCRIPTION || vm.requestType === REQUEST_TYPE.RETIRE_RELATIONSHIP || vm.requestType === REQUEST_TYPE.CHANGE_DESCRIPTION || vm.requestType === REQUEST_TYPE.CHANGE_RELATIONSHIP || vm.requestType === REQUEST_TYPE.NEW_RELATIONSHIP || vm.requestType === REQUEST_TYPE.NEW_DESCRIPTION) {
                        for (var j in requestData.requestItems) {
                            if (requestData.requestItems[j].requestType === REQUEST_TYPE.CHANGE_RETIRE_CONCEPT.value) {
                                requestData.requestItems.splice(j, 1);
                            }
                            if (requestData.requestItems[j].requestType === REQUEST_TYPE.NEW_RELATIONSHIP.value && vm.requestType !== REQUEST_TYPE.NEW_RELATIONSHIP) {
                                requestData.requestItems.splice(j, 1);
                            }
                            if(vm.requestType === REQUEST_TYPE.RETIRE_DESCRIPTION){
                                if (requestData.requestItems[j].requestType === REQUEST_TYPE.NEW_DESCRIPTION.value) {
                                    requestData.requestItems.splice(j, 1);
                                }
                            }
                        }
                    } 
                }

                requestService.saveRequest(requestData)
                    .then(function(response) {
                        var requestId = response.id;
                        vm.request.id = requestId;

                        return requestService.submitRequest(requestId);
                    })
                    .then(function() {
                        notificationService.sendMessage('crs.request.message.requestSubmitted', 5000);
                        goBackToPreviousList();
                    }, function(e) {
                        showErrorMessage(e.message);
                    })
                    .finally(function() {
                        $rootScope.showAppLoading = false;
                    });
            };

            var unassignSelectedRequests = function(){
                notificationService.sendMessage('crs.request.message.requestUnassigning', 5000);
                return requestService.unassignRequest(vm.request.id).then(function() {
                    notificationService.sendMessage('crs.request.message.requestUnassigned', 5000);
                    goBackToPreviousList();
                }, function(e) {
                    console.log(e);
                    showErrorMessage(e.message);
                })
                .finally(function() {
                    $rootScope.showAppLoading = false;
                });
            };

            var changeRequestStatus = function(requestId, requestStatus, data) {
                // show loading mask
                $rootScope.showAppLoading = true;

                notificationService.sendMessage('crs.request.message.requestProcessing');
                return requestService.changeRequestStatus(requestId, requestStatus, data)
                    .finally(function() {
                        $rootScope.showAppLoading = false;
                    });
            };

            var acceptRequest = function() {
                changeRequestStatus(vm.request.id, REQUEST_STATUS.ACCEPTED)
                    .then(function() {
                        notificationService.sendMessage('crs.request.message.requestAccepted', 5000);
                        goBackToPreviousList();
                    }, function(e) {
                        showErrorMessage(e.message);
                    });
            };

            var moveToInInceptionElaboration = function() {
                var modalInstance = openStatusCommentModal('inInceptionElaboration');
                modalInstance.result.then(function(response) {
                    changeRequestStatus(vm.request.id, REQUEST_STATUS.IN_INCEPTION_ELABORATION, { contentRequestUrl: response.contentRequestUrl, trackerId: response.trackerId})
                        .then(function() {
                            notificationService.sendMessage('crs.request.message.requestAccepted', 5000);
                            goBackToPreviousList();
                        }, function(e) {
                            showErrorMessage(e.message);
                        });
                });
            };

            var openAssignRequestModal = function() {
                var defaultSummaryRequestType = translateFilter(translateRequestTypeFilter(vm.request.requestType));               
                var defaultSummary = $filter('limitTo')('[' + defaultSummaryRequestType + '] ' + vm.request.additionalFields.summary, 255, 0);
                return $uibModal.open({
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
            };

            var openAssignRequestToStaffModal = function() {
                return $uibModal.open({
                    templateUrl: 'components/request/modal-assign-request-to-staff.html',
                    controller: 'ModalAssignRequestToStaffCtrl as modal',
                    resolve: {
                        staffs: function() {
                            return vm.staffs;
                        }
                    }
                });
            };

            var openReassignRequestToRequestorModal = function(){
                return $uibModal.open({
                    templateUrl: 'components/request/modal-reassign-request-to-requestor.html',
                    controller: 'ModalAssignRequestToRequestorCtrl as modal',
                    resolve: {
                        requestors: function() {
                            return vm.authors;
                        }
                    }
                });
            };

            var assignRequest = function() {
                if (vm.authors.length > 0 && vm.projects.length > 0) {
                    var modalInstance = openAssignRequestModal();

                    modalInstance.result.then(function(rs) {
                        notificationService.sendMessage('Assigning requests');
                        requestService.assignRequests([vm.request.id], rs.project.key, ((rs.assignee) ? rs.assignee.key : null), rs.summary).then(function() {
                            notificationService.sendMessage('Request assigned successfully', 5000);
                            goBackToPreviousList();
                        });
                    });
                }
            };

            var acceptAndAssignRequest = function() {
                if (vm.authors.length > 0 && vm.projects.length > 0) {
                    var modalInstance = openAssignRequestModal();
                    modalInstance.result.then(function(rs) {
                        changeRequestStatus(vm.request.id, REQUEST_STATUS.ACCEPTED)
                            .then(function() {
                                return requestService.assignRequests([vm.request.id], rs.project.key, ((rs.assignee) ? rs.assignee.key : null), rs.summary);
                            }, function(e) {
                                showErrorMessage(e.message);
                                $q.reject(e);
                            })
                            .then(function() {
                                notificationService.sendMessage('Request accepted and assigned successfully', 5000);
                                goBackToPreviousList();
                            });
                    });
                }
            };

            var assignRequestToStaff = function(status) {
                if (vm.staffs.length > 0) {
                    var modalInstance = openAssignRequestToStaffModal();
                    modalInstance.result.then(function(rs) {
                        if(status === REQUEST_STATUS.NEW.value){
                            changeRequestStatus(vm.request.id, REQUEST_STATUS.ACCEPTED)
                            .then(function() {
                                return requestService.assignRequestsToStaff([vm.request.id], ((rs.assignee) ? rs.assignee.key : null));
                            }, function(e) {
                                showErrorMessage(e.message);
                                $q.reject(e);
                            })
                            .then(function() {
                                notificationService.sendMessage('Request accepted and assigned successfully', 5000);
                                goBackToPreviousList();
                            });
                        }else{
                            notificationService.sendMessage('Assigning requests');
                            requestService.assignRequestsToStaff([vm.request.id], ((rs.assignee) ? rs.assignee.key : null)).then(function() {
                                notificationService.sendMessage('Request assigned successfully', 5000);
                                goBackToPreviousList();
                            });
                        }
                    });
                }
            };

            var reassignToRequestor = function() {
                if (vm.staffs.length > 0) {
                    var modalInstance = openReassignRequestToRequestorModal();
                    modalInstance.result.then(function(rs) {
                            notificationService.sendMessage('Changing requestor...', 5000);
                            return requestService.reassignRequestToRequestor([vm.request.id], ((rs.assignee) ? rs.assignee.key : null))
                            .then(function() {
                                notificationService.sendMessage('Requestor has been changed successfully', 5000);
                                goBackToPreviousList();
                            });
                    });
                }
            };

            var rejectRequest = function() {
                var modalInstance = openStatusCommentModal('reject');

                modalInstance.result.then(function(rejectComment) {
                    changeRequestStatus(vm.request.id, REQUEST_STATUS.REJECTED, { reason: rejectComment })
                    .then(function() {
                        notificationService.sendMessage('crs.request.message.requestRejected', 5000);
                        goBackToPreviousList();
                    }, function(e) {
                        showErrorMessage(e.message);
                    });
                });
            };

            var unassignAndRejectRequest = function(){
                var modalInstance = openStatusCommentModal('unassignAndReject');

                modalInstance.result.then(function(rejectComment) {
                    notificationService.sendMessage('crs.request.message.requestUnassigningAndRejecting', 5000);
                    return requestService.unassignRequest(vm.request.id).then(function() {
                        changeRequestStatus(vm.request.id, REQUEST_STATUS.REJECTED, { reason: rejectComment })
                        .then(function() {
                            notificationService.sendMessage('crs.request.message.requestUnassignedAndRejected', 5000);
                            goBackToPreviousList();
                        }, function(e) {
                            showErrorMessage(e.message);
                        });
                    }, function(e) {
                        console.log(e);
                        showErrorMessage(e.message);
                    })
                    .finally(function() {
                        $rootScope.showAppLoading = false;
                    });
                });
            };

            var rejectAppeal = function() {
                var modalInstance = openStatusCommentModal('reject');

                modalInstance.result.then(function(rejectComment) {
                    changeRequestStatus(vm.request.id, REQUEST_STATUS.APPEAL_REJECTED, { reason: rejectComment })
                        .then(function() {
                            notificationService.sendMessage('crs.request.message.requestRejected', 5000);
                            goBackToPreviousList();
                        }, function(e) {
                            showErrorMessage(e.message);
                        });
                });
            };

            var requestInAppealClarification = function() {

                var modalInstance = openStatusCommentModal('inAppealClarification');

                modalInstance.result.then(function(comment) {
                    changeRequestStatus(vm.request.id, REQUEST_STATUS.IN_APPEAL_CLARIFICATION, { reason: comment })
                        .then(function() {
                            notificationService.sendMessage('crs.request.message.inAppealClarification', 5000);
                            goBackToPreviousList();
                        }, function(e) {
                            showErrorMessage(e.message);
                        });
                });
            };

            var requestClarification = function() {

                var modalInstance = openStatusCommentModal('needClarify');

                modalInstance.result.then(function(rejectComment) {
                    changeRequestStatus(vm.request.id, REQUEST_STATUS.CLARIFICATION_NEEDED, { reason: rejectComment })
                        .then(function() {
                            notificationService.sendMessage('crs.request.message.requestClarification', 5000);
                            goBackToPreviousList();
                        }, function(e) {
                            showErrorMessage(e.message);
                        });
                });
            };

            var appealRequest = function() {
                var modalInstance = openStatusCommentModal('appeal');

                modalInstance.result.then(function(appealComment) {
                    changeRequestStatus(vm.request.id, REQUEST_STATUS.APPEAL, { reason: appealComment })
                        .then(function() {
                            notificationService.sendMessage('crs.request.message.requestAppealed', 5000);
                            goBackToPreviousList();
                        }, function(e) {
                            showErrorMessage(e.message);
                        });
                });
            };

            var withdrawRequest = function() {
                var modalInstance = openStatusCommentModal('withdraw');

                modalInstance.result.then(function(withdrawComment) {
                    changeRequestStatus(vm.request.id, REQUEST_STATUS.WITHDRAWN, { reason: withdrawComment })
                        .then(function() {
                            notificationService.sendMessage('crs.request.message.requestWithdrawn', 5000);
                            goBackToPreviousList();
                        }, function(e) {
                            showErrorMessage(e.message);
                        });
                });
            };

            var startEditingConcept = function(conceptObj) {
                notificationService.sendMessage('Loading concept ' + (conceptObj.name ? conceptObj.name : conceptObj.id) + ' to edit panel', 10000, null);
                snowowlService.getFullConcept(null, null, conceptObj.id).then(function(response) {
                    notificationService.sendMessage('Concept ' + response.fsn + ' successfully added to edit list', 5000, null);
                    response.definitionOfChanges = buildChangeConceptDefinitionOfChanges();
                    response.definitionOfChanges.currentFsn = response.fsn;
                    vm.originalConcept = response;
                    vm.concept = angular.copy(vm.originalConcept);
                });
            };

            var setInputMode = function(im) {
                var imObj = identifyInputMode(im);

                if (imObj !== null && imObj !== vm.inputMode) {
                    if (vm.inputMode === REQUEST_INPUT_MODE.SIMPLE &&
                        imObj === REQUEST_INPUT_MODE.DIRECT) {

                        if (!validateRequest(true)) {
                            return;
                        }

                        vm.concept = buildConceptFromRequest(vm.request);
                    }

                    vm.inputMode = imObj;
                }
            };

            var onConceptChangedDirectly = function(historyCount) {
                if (!permanentlyDisableSimpleMode) {
                    if (historyCount === 0) {
                        vm.disableSimpleMode = false;
                    } else if (historyCount > 0) {
                        vm.disableSimpleMode = true;
                    }
                }
            };

            var openStatusCommentModal = function(requestStatus) {
                return $uibModal.open({
                    templateUrl: 'components/request/modal-change-request-status.html',
                    controller: 'ModalChangeRequestStatusCtrl as modal',
                    resolve: {
                        requestStatus: function() {
                            return requestStatus;
                        }
                    }
                });
            };

            $scope.$on(CONCEPT_EDIT_EVENT.STOP_EDIT_CONCEPT, function(event, data) {
                if (!data || !data.concept) {
                    console.error('Cannot remove concept: concept must be supplied');
                    return;
                }

                if (data && data.concept.conceptId === vm.concept.conceptId) {
                    vm.originalConcept = null;
                    vm.concept = null;
                }
            });


            $scope.$watch(function() {
                return vm.inputMode;
            }, function(newVal) {
                if (newVal === REQUEST_INPUT_MODE.DIRECT) {
                    vm.inputModePage = 'components/request/request-details-edit-panel.html';
                    vm.reFilterRelationship = false;
                } else if (newVal === REQUEST_INPUT_MODE.SIMPLE) {
                    vm.inputModePage = vm.requestType.form.template;
                } else {
                    vm.inputModePage = null;
                }
            });

            $scope.$watch(function() {
                return vm.selectedRelationships;
            }, function(newVal) {
                if (angular.isArray(newVal)) {
                    vm.request.relationshipId = selectedRelationshipsOutput();
                }
            });

            //watch proposedStatus to set default History Attribute
            $scope.$watch(function() {
                if(vm.requestType === REQUEST_TYPE.CHANGE_RETIRE_CONCEPT){
                    return vm.request.proposedStatus;
                }
            }, function(newVal) {
               if(newVal === vm.newConceptStatuses[1]){
                    vm.request.historyAttribute = vm.historyAttributes[4];
               }
            });

            //auto fill preferred term field
            $scope.$watch(function() {
                if(vm.requestType === REQUEST_TYPE.NEW_CONCEPT && vm.request.proposedFSN && autoFillPreferredTerm){
                    return vm.request.proposedFSN;
                }
            }, function(newVal) {
                if(newVal && vm.requestType === REQUEST_TYPE.NEW_CONCEPT && vm.request.proposedFSN && autoFillPreferredTerm){
                    var indexOfFSN = vm.request.proposedFSN.indexOf("(");
                    if(indexOfFSN !== -1){
                        var substringFSN = vm.request.proposedFSN.substring(0, indexOfFSN);
                        var trimFSN = substringFSN.trim();
                        vm.request.conceptPT = trimFSN;
                    }else{
                        var trimFsn = vm.request.proposedFSN.trim();
                        vm.request.conceptPT = trimFsn;
                    }
                }
            });

            //auto fill new concept fsn field
            $scope.$watch(function() {
                if(vm.requestType === REQUEST_TYPE.NEW_CONCEPT && vm.request.value && autoFillPreferredTerm){
                    return vm.request.value;
                }
            }, function(newVal) {
                if(newVal && vm.requestType === REQUEST_TYPE.NEW_CONCEPT && vm.request.value && autoFillPreferredTerm){
                    if(vm.request.proposedFSN){
                        var indexOfFSN = vm.request.proposedFSN.indexOf("(");
                        if(indexOfFSN !== -1){
                            var substringFSN = vm.request.proposedFSN.substring(0, indexOfFSN);
                            var trimFSN = substringFSN.trim();
                            vm.request.proposedFSN = trimFSN + ' (' + newVal + ')';
                        }else{
                            var trimFsn = vm.request.proposedFSN.trim();
                            vm.request.proposedFSN = trimFsn + ' (' + newVal + ')';
                        }
                    }else{
                        vm.request.proposedFSN = '(' + newVal + ')';
                    }
                }
            });

            //auto fill justification filed
            $scope.$on('justificationForChange', function(event, args) {

                vm.request.additionalFields.reasonForChange = extractJustification(args);
            });

            var changeRetireConceptDOC, newDescDOC, changeDescDOC, newRelaionshipDOC, changeRelationshipDOC;

            var extractJustification = function(args){
                var change;
                switch(args.changeNote.changeType){
                    case REQUEST_TYPE.CHANGE_RETIRE_CONCEPT.value:
                        changeRetireConceptDOC = '[' + 'Change Or Retire Concept' + ': ' + args.changeNote.reasonForChange + ']';
                        break;
                    case REQUEST_TYPE.NEW_DESCRIPTION.value:
                        newDescDOC = '[' + 'New Description' + ': ' + args.changeNote.reasonForChange + ']';
                        break;
                    case REQUEST_TYPE.CHANGE_DESCRIPTION.value:
                        changeDescDOC = '[' + 'Change Description' + ': ' + args.changeNote.reasonForChange + ']';
                        break;
                    case REQUEST_TYPE.NEW_RELATIONSHIP.value:
                        newRelaionshipDOC = '[' + 'New Relationship' + ': ' + args.changeNote.reasonForChange + ']';
                        break;
                    case REQUEST_TYPE.CHANGE_RELATIONSHIP.value:
                        changeRelationshipDOC = '[' + 'Change Relationship' + ': ' + args.changeNote.reasonForChange + ']';
                        break;
                }
                
                change = (changeRetireConceptDOC? changeRetireConceptDOC + '\n': '') + 
                         (newDescDOC? newDescDOC + '\n': '') + 
                         (changeDescDOC? changeDescDOC + '\n': '') +
                         (newRelaionshipDOC?newRelaionshipDOC + '\n': '') +
                         (changeRelationshipDOC?changeRelationshipDOC + '\n': '');
                return change;
            };

            $scope.$watch(function() {
                if(vm.requestType === REQUEST_TYPE.NEW_RELATIONSHIP || vm.requestType === REQUEST_TYPE.CHANGE_RELATIONSHIP){
                    return vm.request.destinationTerminology;
                }
            }, function(newVal) {
                if(newVal && (vm.requestType === REQUEST_TYPE.NEW_RELATIONSHIP || vm.requestType === REQUEST_TYPE.CHANGE_RELATIONSHIP) && vm.request.destinationTerminology){
                    $rootScope.$broadcast('destinationTerminologyChange', {
                        desTerminology: vm.request.destinationTerminology
                    });
                }
            });

            var detectCurrentList = function(list){
                var detectedCurrentList;
                
                switch(list){
                    case 'requests':
                        detectedCurrentList = requestService.getFilterValues();
                        break;
                    case 'my-assigned-requests':
                        detectedCurrentList = requestService.getAssignedFilterValues();
                        break;
                    case 'submitted-requests':
                        detectedCurrentList = requestService.getSubmittedFilterValues();
                        break;
                    case 'accepted-requests':
                        detectedCurrentList = requestService.getAcceptedFilterValues();
                        break;
                    default:
                        if(vm.isAdmin || vm.isStaff){
                            detectedCurrentList = requestService.getAssignedFilterValues();
                        }else if(vm.isRequester){
                            detectedCurrentList = requestService.getFilterValues();
                        }else{
                            detectedCurrentList = requestService.getSubmittedFilterValues();
                        }
                }

                return detectedCurrentList;
            };

            var getNextRequest = function(){
                notificationService.sendMessage('Loading...');
                var list = requestService.getCurrentList();
                var newList = false,
                    isIdInCurrentList = true;
                var currentList = detectCurrentList(list);
                var currentIdList = requestService.getCurrentIdList(list);
                var pageMode = $routeParams.mode;
                var currentId = Number($routeParams.param);
                if(!currentIdList){
                    getCurrentRequestIdList(currentList);
                }else{
                    if(currentId === currentIdList[currentIdList.length - 1]){
                        newList = true;
                        currentList.offset = currentList.offset + 1;
                        getCurrentRequestIdList(currentList, newList);
                    }else{
                        for(var i = 0; i < currentIdList.length; i++){
                            if(currentId === currentIdList[i]){
                                $location.path('requests/' + pageMode + '/' + currentIdList[i + 1]).search();
                            }else{
                                isIdInCurrentList = false;
                            }
                        }
                        if(isIdInCurrentList === false){
                            getCurrentRequestIdList(currentList);
                        }
                    }
                }
            };

            var goBackToPreviousList = function(){
                var list = requestService.getCurrentList();
                $location.path('/' + list).search({});
            };

            var getCurrentRequestIdList = function(currentList, newList){
                var list = requestService.getCurrentList();
                var currentRequestId = Number($routeParams.param);
                var pageMode = $routeParams.mode;
                requestService.getNextRequestList(currentList).then(function(response){
                    if(response){
                        requestService.setCurrentIdList(response, list);
                        if(currentRequestId === response[response.length - 1]){
                            var tmpCurrentList = currentList;
                            tmpCurrentList.offset = currentList.offset + 1;
                            var tmpNewList = true;
                            getCurrentRequestIdList(tmpCurrentList, tmpNewList);
                        }else{
                            for(var i = 0; i < response.length; i++){
                                if(currentRequestId === response[i]){
                                    $location.path('requests/' + pageMode + '/' + response[i + 1]).search();
                                }else if(newList){
                                    $location.path('requests/' + pageMode + '/' + response[0]).search();
                                }
                            }
                        }
                    }
                });
            };
            var changeLocalCode = function(){
                var modalInstance = openStatusCommentModal('changeSNOMEDCode');
                modalInstance.result.then(function(localCode) {
                    notificationService.sendMessage('Changing Local Code...', 5000, null);
                    requestService.changeLocalCode(vm.request.id, localCode).then(function(response){
                        vm.request.requestorInternalId = response.requestorInternalId;
                        notificationService.sendMessage('Local Code has been changed', 5000, null);
                    }, function(error){
                        notificationService.sendError(error.message, 5000, null, true);
                    });
                });
            };

            vm.cancelEditing = cancelEditing;
            vm.saveRequest = saveRequest;
            vm.acceptRequest = acceptRequest;
            vm.assignRequest = assignRequest;
            vm.acceptAndAssignRequest = acceptAndAssignRequest;
            vm.assignRequestToStaff = assignRequestToStaff;
            vm.rejectRequest = rejectRequest;
            vm.rejectAppeal = rejectAppeal;
            vm.moveToInInceptionElaboration = moveToInInceptionElaboration;
            vm.requestClarification = requestClarification;
            vm.requestInAppealClarification = requestInAppealClarification;
            vm.saveAndSubmitRequest = saveAndSubmitRequest;
            vm.startEditingConcept = startEditingConcept;
            vm.setInputMode = setInputMode;
            vm.originalConcept = null;
            vm.onConceptChangedDirectly = onConceptChangedDirectly;
            vm.appealRequest = appealRequest;
            vm.withdrawRequest = withdrawRequest;
            vm.getAuthorName = getAuthorName;
            vm.getStaffName = getStaffName;
            vm.unassignSelectedRequests = unassignSelectedRequests;
            vm.loadingProjects = true;
            vm.loadingAuthors = true;
            vm.projects = [];
            vm.authors = [];
            vm.extractJustification = extractJustification;
            vm.unassignAndRejectRequest = unassignAndRejectRequest;
            vm.getNextRequest = getNextRequest;
            vm.reassignToRequestor = reassignToRequestor;
            vm.changeLocalCode = changeLocalCode;
            vm.isAdmin = false;
            vm.isViewer = false;
            vm.permissionChecked = false;
            vm.isCameFromRequestList = false;
            vm.error = {};
            vm.conceptStatus = {
                loading: false,
                searching: false,
                valid: true
            };
            vm.duplicateConcept = {
                conceptId: null,
                fsn: null
            };
            vm.sourceTerminologies = [
                {
                    sourceTerminology: "SNOMEDCT",
                    terminologyName: "SNOMED CT International"
                },
                {
                    sourceTerminology: "CURRENTBATCH",
                    terminologyName: "Current Batch Requests"
                },
                {
                    sourceTerminology: "NEWCONCEPTREQUESTS",
                    terminologyName: "New Concept Requests"
                }
            ];
            vm.destinationTerminologies = [
                {
                    destinationTerminology: "SNOMEDCT",
                    terminologyName: "SNOMED CT International"
                },
                {
                    destinationTerminology: "CURRENTBATCH",
                    terminologyName: "Current Batch Requests"
                },
                {
                    destinationTerminology: "NEWCONCEPTREQUESTS",
                    terminologyName: "New Concept Requests"
                }
            ];
            
            $scope.panelId = 'REQUEST_DETAILS';

            initView();
        }
    ]);
