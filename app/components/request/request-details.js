'use strict';

angular
    .module('conceptRequestServiceApp.request')
    .controller('RequestDetailsCtrl', [
        '$scope',
        '$rootScope',
        '$routeParams',
        '$location',
        '$anchorScroll',
        'requestService',
        'notificationService',
        'requestMetadataService',
        'objectService',
        'snowowlService',
        'snowowlMetadataService',
        'REQUEST_METADATA_KEY',
        'GENERAL_REQUEST_TYPE',
        'REQUEST_TYPE',
        'CONCEPT_EDIT_EVENT',
        'REQUEST_STATUS',
        function ($scope, $rootScope, $routeParams, $location, $anchorScroll, requestService, notificationService, requestMetadataService, objectService, snowowlService, snowowlMetadataService, REQUEST_METADATA_KEY, GENERAL_REQUEST_TYPE, REQUEST_TYPE, CONCEPT_EDIT_EVENT, REQUEST_STATUS) {
            var vm = this;
            var REQUEST_MODE = {
                NEW: {value: 'new', langKey: 'crs.request.requestMode.newRequest'},
                EDIT: {value: 'edit', langKey: 'crs.request.requestMode.editRequest'}
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
            var mode = $routeParams.mode,
                param = $routeParams.param;

            var requestId,
                generalRequestType;

            var identifyPageMode = function (pm) {
                for (var requestModeKey in REQUEST_MODE) {
                    if (REQUEST_MODE.hasOwnProperty(requestModeKey) &&
                        REQUEST_MODE[requestModeKey].value === pm) {
                        return REQUEST_MODE[requestModeKey];
                    }
                }

                return null;
            };

            var isValidViewParams = function () {
                var pageMode,
                    isValidMode = false,
                    isValidParam = false;

                // check valid mode
                pageMode = identifyPageMode(mode);
                isValidMode = (pageMode !== undefined && pageMode !== null);

                // check valid param
                if (mode === REQUEST_MODE.NEW.value) {
                    isValidParam = (requestService.identifyGeneralRequestType(param) !== null);
                } else {
                    isValidParam = (param !== undefined && param !== null)
                }

                return isValidMode && isValidParam;
            };

            var hideErrorMessage = function () {
                vm.msgError = null;
            };

            var hideSuccessMessage = function () {
                vm.msgSuccess = null;
            };

            var showErrorMessage = function (msg) {
                hideSuccessMessage();
                vm.msgError = msg;

                $anchorScroll('messagePaneLocation');
            };

            var showSuccessMessage = function (msg) {
                hideErrorMessage();
                vm.msgSuccess = msg;
                $window.scrollTop = 0;
            };

            var buildNewConceptDefinitionOfChanges = function (changeId) {
                return {
                    changeId: (changeId)?changeId:null,
                    changeType: REQUEST_TYPE.NEW_CONCEPT.value,
                    changed: false
                }
            };

            var buildChangeConceptDefinitionOfChanges = function () {
                return {
                    changeId: null,
                    changeType: REQUEST_TYPE.CHANGE_RETIRE_CONCEPT.value,
                    changed: false
                }
            };

            var initView = function () {
                var isValid = isValidViewParams();

                if (!isValid) {
                    showErrorMessage('crs.request.message.error.invalidPage');
                } else {
                    if (mode === REQUEST_MODE.NEW.value) {
                        requestId = null;
                        generalRequestType = requestService.identifyGeneralRequestType(param);
                        $rootScope.pageTitles = ['crs.request.details.title.new', generalRequestType.langKey];

                        vm.request = {
                            id: requestId,
                            requestHeader: {
                                status: REQUEST_STATUS.DRAFT.value
                            }
                        };

                        if (generalRequestType === GENERAL_REQUEST_TYPE.NEW_CONCEPT) {
                            vm.concept = objectService.getNewConcept();
                            vm.concept.definitionOfChanges = buildNewConceptDefinitionOfChanges();
                        }

                        vm.generalRequestType = generalRequestType;
                        vm.isValidViewParams = isValid;
                    } else if (mode === REQUEST_MODE.EDIT.value) {
                        requestId = param;
                        $rootScope.pageTitles = ['crs.request.details.title.edit'];

                        $rootScope.showLoading = true;
                        loadRequest().then(function () {
                            var conceptId = vm.request.concept.id;

                            $rootScope.showLoading = false;

                            if (conceptId !== undefined && conceptId !== null) {
                                generalRequestType = GENERAL_REQUEST_TYPE.EDIT_CONCEPT;
                            } else {
                                generalRequestType = GENERAL_REQUEST_TYPE.NEW_CONCEPT;
                            }

                            if (generalRequestType) {
                                $rootScope.pageTitles.push(vm.request.id);
                                vm.generalRequestType = generalRequestType;
                                vm.isValidViewParams = isValid;
                            } else {
                                showErrorMessage('crs.request.message.error.invalidPage');
                            }
                        });
                    }

                    vm.pageMode = identifyPageMode(mode);
                    loadRequestMetadata();
                }
            };

            var loadRequest = function () {
                notificationService.sendMessage('crs.request.message.requestLoading', 0);

                vm.request = null;

                return requestService.getRequest(requestId).then(function (response) {
                    vm.request = response;
                    vm.concept = response.concept;

                    /*vm.request.rfcNumber = response.rfcNumber;
                     vm.request.status = response.status;*/
                    notificationService.sendMessage('crs.request.message.requestLoaded', 5000);
                });
            };

            var loadRequestMetadata = function () {
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
                    .then(function (metadata) {
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

            var cancelEditing = function () {
                $location.path('/dashboard');
            };

            var identifyParentConcept = function (concept) {
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

            var extractConceptDescriptions = function (concept, descriptionType, extractAll) {
                var description, descriptions = [];

                if (concept &&
                    angular.isArray(concept.descriptions) &&
                    concept.descriptions.length > 0) {
                    for (var i = 0; i < concept.descriptions.length; i++) {
                        description = concept.descriptions[i];

                        if (description.type === descriptionType
                            && (extractAll || description.definitionOfChanges) // extract all or only changes descriptions
                            && description.active === true) {
                            descriptions.push(description);
                        }
                    }
                }

                return descriptions;
            };

            var extractConceptFSN = function (concept) {
                var fsns = extractConceptDescriptions(concept, DESCRIPTION_TYPE.FSN, true);

                if (fsns.length > 0) {
                    return fsns[0].term;
                }

                return null;
            };

            var extractConceptPT = function (concept) {
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

            var extractConceptSynonyms = function (concept, extractAll) {
                var syns = extractConceptDescriptions(concept, DESCRIPTION_TYPE.SYN, extractAll);
                var sysnTerms = [];

                for (var i = 0; i < syns.length; i++) {
                    sysnTerms.push(syns[i].term);
                }

                return sysnTerms;
            };

            var extractConceptDefinitions = function (concept, extractAll) {
                var defs = extractConceptDescriptions(concept, DESCRIPTION_TYPE.DEF, extractAll);
                var defTerms = [];

                for (var i = 0; i < defs.length; i++) {
                    defTerms.push(defs[i].term);
                }

                return defTerms;
            };


            var buildRequestWorkItem = function (request, concept) {
                var item = {};
                var parentConcept;

                item.requestType = concept.definitionOfChanges.changeType;
                item.id = concept.definitionOfChanges.changeId;
                item.reasonForChange = concept.definitionOfChanges.reasonForChange;
                item.notes = concept.definitionOfChanges.notes;
                item.reference = concept.definitionOfChanges.reference;

                switch (item.requestType) {
                    case REQUEST_TYPE.NEW_CONCEPT.value:
                        parentConcept = identifyParentConcept(concept);
                        item.parentId = (parentConcept) ? parentConcept.id : null;
                        item.parentFSN = (parentConcept) ? parentConcept.fsn : null;
                        item.proposedFSN = extractConceptFSN(concept);
                        item.conceptPT = extractConceptPT(concept);
                        item.proposedSynonyms = extractConceptSynonyms(concept, true);
                        item.proposedDefinitions = extractConceptDefinitions(concept, true);
                        break;
                }

                return item;

            };

            var buildRequestDetails = function (request, concept, pageMode) {
                var requestDetails = {};
                requestDetails.id = request.id;
                requestDetails.requestItems = [];
                requestDetails.concept = concept;

                // check concept changes
                if (concept.definitionOfChanges) {
                    requestDetails.requestItems.push(buildRequestWorkItem(request, concept));
                }

                return requestDetails;
            };

            var saveRequest = function () {

                var requestDetails = buildRequestDetails(vm.request, vm.concept, vm.pageMode);

                requestService.saveRequest(requestDetails)
                    .then(function (response) {
                        notificationService.sendMessage('crs.request.message.requestSaved', 5000);
                        $location.path('/dashboard');
                    }, function (e) {
                        showErrorMessage(e.message)
                    });
            };

            var saveAndSubmitRequest = function () {
                var requestDetails = buildRequestDetails(vm.request, vm.concept, vm.pageMode);

                requestService.saveRequest(requestDetails)
                    .then(function (response) {
                        var requestId = response.id;

                        return requestService.submitRequest(requestId);
                    })
                    .then(function (response) {
                        notificationService.sendMessage('crs.request.message.requestSubmitted', 5000);
                        $location.path('/dashboard');
                    }, function (e) {
                        showErrorMessage(e.message)
                    });
            };

            var startEditingConcept = function (conceptObj) {
                notificationService.sendMessage('Loading concept ' + (conceptObj.name ? conceptObj.name : conceptObj.id) + ' to edit panel', 10000, null);
                snowowlService.getFullConcept(null, null, conceptObj.id).then(function (response) {
                    notificationService.sendMessage('Concept ' + response.fsn + ' successfully added to edit list', 5000, null);
                    response.definitionOfChanges = buildChangeConceptDefinitionOfChanges();
                    vm.concept = response;
                });
            };

            $scope.$on(CONCEPT_EDIT_EVENT.STOP_EDIT_CONCEPT, function (event, data) {
                if (!data || !data.concept) {
                    console.error('Cannot remove concept: concept must be supplied');
                    return;
                }

                if (data && data.concept.id === vm.concept.id) {
                    vm.concept = null;
                }
            });

            vm.cancelEditing = cancelEditing;
            vm.saveRequest = saveRequest;
            vm.saveAndSubmitRequest = saveAndSubmitRequest;
            vm.startEditingConcept = startEditingConcept;

            $scope.panelId = 'REQUEST_DETAILS';

            initView();
        }
    ]);