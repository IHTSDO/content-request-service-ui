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
        'requestService',
        'notificationService',
        'requestMetadataService',
        'objectService',
        'snowowlService',
        'snowowlMetadataService',
        'REQUEST_METADATA_KEY',
        'REQUEST_TYPE',
        'CONCEPT_EDIT_EVENT',
        'REQUEST_STATUS',
        'REQUEST_INPUT_MODE',
        function ($scope, $rootScope, $routeParams, $location, $anchorScroll, $uibModal, requestService, notificationService, requestMetadataService, objectService, snowowlService, snowowlMetadataService, REQUEST_METADATA_KEY, REQUEST_TYPE, CONCEPT_EDIT_EVENT, REQUEST_STATUS, REQUEST_INPUT_MODE) {
            var vm = this;
            var REQUEST_MODE = {
                NEW: {value: 'new', langKey: 'crs.request.requestMode.newRequest'},
                EDIT: {value: 'edit', langKey: 'crs.request.requestMode.editRequest'},
                PREVIEW: {value: 'preview', langKey: 'crs.request.requestMode.previewRequest'}
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
                param = $routeParams.param,
                inputMode = $routeParams.inputMode;

            var requestId,
                requestType;

            var permanentlyDisableSimpleMode = false;

            var identifyPageMode = function (pm) {
                for (var requestModeKey in REQUEST_MODE) {
                    if (REQUEST_MODE.hasOwnProperty(requestModeKey) &&
                        REQUEST_MODE[requestModeKey].value === pm) {
                        return REQUEST_MODE[requestModeKey];
                    }
                }

                return null;
            };

            var identifyInputMode = function (im) {
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

            var isValidViewParams = function () {
                var pageMode,
                    isValidPageMode = false,
                    isValidParam = false,
                    isValidInputMode = false;

                // check valid mode
                pageMode = identifyPageMode(mode);
                isValidPageMode = (pageMode !== undefined && pageMode !== null);

                // check valid param
                switch(pageMode) {
                    case  REQUEST_MODE.NEW:
                        isValidParam = (requestService.identifyRequestType(param) !== null);
                        isValidInputMode = (identifyInputMode(inputMode) !== null);
                        break;
                    case REQUEST_MODE.EDIT:
                    case REQUEST_MODE.PREVIEW:
                        isValidParam = (param !== undefined && param !== null);
                        isValidInputMode = true;
                        break;
                }

                return isValidPageMode && isValidParam && isValidInputMode;
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
                    changed: true
                }
            };

            var buildChangeConceptDefinitionOfChanges = function () {
                return {
                    changeId: null,
                    changeType: REQUEST_TYPE.CHANGE_RETIRE_CONCEPT.value,
                    changed: true
                }
            };

            var initView = function () {
                var isValid = isValidViewParams();
                var originConcept;

                if (!isValid) {
                    showErrorMessage('crs.request.message.error.invalidPage');
                } else {
                    vm.pageMode = identifyPageMode(mode);

                    switch (vm.pageMode) {
                        case REQUEST_MODE.NEW:
                            requestId = null;
                            requestType = requestService.identifyRequestType(param);
                            $rootScope.pageTitles = ['crs.request.details.title.new', requestType.langKey];

                            vm.request = {
                                id: requestId,
                                additionalFields: {},
                                requestHeader: {
                                    status: REQUEST_STATUS.DRAFT.value
                                }
                            };

                            if (requestType === REQUEST_TYPE.NEW_CONCEPT) {
                                originConcept = objectService.getNewConcept();
                                originConcept.definitionOfChanges = buildNewConceptDefinitionOfChanges();
                                vm.originalConcept = originConcept;
                                vm.concept = angular.copy(vm.originalConcept);
                            }

                            vm.requestType = requestType;
                            vm.isValidViewParams = isValid;
                            vm.inputMode = identifyInputMode(inputMode);
                            break;
                        case REQUEST_MODE.EDIT:
                        case REQUEST_MODE.PREVIEW:
                            requestId = param;
                            $rootScope.pageTitles = ['crs.request.details.title.edit'];

                            vm.disableSimpleMode = true;
                            loadRequest().then(function (requestData) {
                                var requestType = requestService.identifyRequestType(vm.request.requestType);
                                var inputMode = identifyInputMode(vm.request.inputMode);

                                if (requestType) {
                                    $rootScope.pageTitles.push(vm.request.id);
                                    vm.requestType = requestType;
                                    vm.inputMode = inputMode;
                                    vm.isValidViewParams = isValid;

                                    permanentlyDisableSimpleMode = (vm.inputMode === REQUEST_INPUT_MODE.DIRECT);
                                    vm.disableSimpleMode = (vm.inputMode === REQUEST_INPUT_MODE.DIRECT);

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

            var loadRequest = function () {
                var originConcept;

                notificationService.sendMessage('crs.request.message.requestLoading', 0);

                vm.request = null;

                return requestService.getRequest(requestId).then(function (requestData) {
                    // build request
                    vm.request = buildRequestFromRequestData(requestData);

                    // get original concept
                    if (requestData.requestType === REQUEST_TYPE.NEW_CONCEPT.value) {
                        originConcept = objectService.getNewConcept();
                        originConcept.definitionOfChanges = buildNewConceptDefinitionOfChanges();
                        vm.originalConcept = originConcept;

                        //return null;
                    } else {
                        vm.originalConcept = {
                            conceptId: requestData.concept.conceptId,
                            fsn: requestData.concept.fsn
                        };
                        /*return snowowlService.getFullConcept(null, null, requestData.concept.conceptId).then(function (response) {
                            originalConcept = response;
                            vm.originalConcept = response;
                        });*/
                    }

                    // rebuild concept from request data
                    vm.concept = requestData.concept;

                    return requestData
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
                $location.path('/dashboard').search({});
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

            var injectParentConcept = function (concept, parentConcept) {
                var isaRelationship = objectService.getNewIsaRelationship(concept.conceptId);

                if (!angular.isArray(concept.relationships)) {
                    concept.relationships = [];
                }

                isaRelationship.target = parentConcept;
                concept.relationships.push(isaRelationship);
            };

            var injectRelationship = function (concept, relationshipType, destinationConcept, characteristicType, refinability, applyChanges) {
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
                    }
                }

                concept.relationships.push(relationship);
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

            var injectConceptDescription = function (concept, descriptionTerm, applyChanges) {
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

            var cloneConceptDescription = function (concept, sourceDescriptionId, proposedTerm, proposedCaseSignificance, applyChanges, descriptionStatus) {
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
                        proposedTerm.trim() !== '' ) {
                        newDesc.term = proposedTerm;
                    }

                    if (proposedCaseSignificance) {
                        newDesc.caseSignificance = proposedCaseSignificance;
                    }

                    if (applyChanges) {
                        newDesc.definitionOfChanges = {
                            changeId: null,
                            changeType: REQUEST_TYPE.NEW_DESCRIPTION.value,
                            changed: true
                        };
                    }

                    if (!angular.isArray(concept.descriptions)) {
                        concept.descriptions = [];
                    } else if (applyChanges) {
                        sourceDescription.active = false;
                        sourceDescription.definitionOfChanges = {
                            changeId: null,
                            changeType: REQUEST_TYPE.CHANGE_RETIRE_DESCRIPTION.value,
                            changed: true,
                            descriptionStatus: descriptionStatus,
                            proposedDescription: proposedTerm
                        };
                    }

                    concept.descriptions.push(newDesc);
                }
            };

            var extractConceptFSN = function (concept) {
                var fsns = extractConceptDescriptions(concept, DESCRIPTION_TYPE.FSN, true);

                if (fsns.length > 0) {
                    return fsns[0].term;
                }

                return null;
            };

            var injectConceptFSN = function (concept, fsn, applyChanges) {
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
                            changeType: REQUEST_TYPE.CHANGE_RETIRE_DESCRIPTION.value,
                            changed: true,
                            descriptionStatus: 'Retired'
                        }
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

            var injectConceptPT = function (concept, conceptPT, applyChanges) {
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

            var extractConceptSynonyms = function (concept, excludePT, extractAll) {
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

            var injectConceptSynonyms = function (concept, synonyms, applyChanges) {
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

            var extractItemByRequestType = function (requestItems, type) {
                for (var i = 0 ; i < requestItems.length; i++){
                    if (requestItems[i].requestType === type.value) {
                        return requestItems[i];
                    }
                }

                return null;
            };

            var extractConceptDefinitions = function (concept, extractAll) {
                var defs = extractConceptDescriptions(concept, DESCRIPTION_TYPE.DEF, extractAll);
                var defTerms = [];

                for (var i = 0; i < defs.length; i++) {
                    defTerms.push(defs[i].term);
                }

                return defTerms;
            };

            var injectConceptDefinitions = function (concept, definitions, applyChanges) {
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

            var buildRequestWorkItem = function (concept, definitionOfChanges, changedTarget) {
                var item = {};
                var parentConcept, isDescriptionPT = false;

                item.requestType = definitionOfChanges.changeType;
                item.id = definitionOfChanges.changeId;

                item.topic = concept.definitionOfChanges.topic;
                item.reasonForChange = concept.definitionOfChanges.reasonForChange;
                item.notes = concept.definitionOfChanges.notes;
                item.reference = concept.definitionOfChanges.reference;

                switch (item.requestType) {
                    case REQUEST_TYPE.NEW_CONCEPT.value:
                        parentConcept = identifyParentConcept(concept);
                        item.parentId = (parentConcept) ? parentConcept.id : null;
                        item.parentFSN = (parentConcept) ? parentConcept.fsn : null;
                        item.proposedFSN = concept.fsn;
                        item.conceptPT = extractConceptPT(concept);
                        item.proposedSynonyms = extractConceptSynonyms(concept, item.conceptPT, true);
                        item.proposedDefinitions = extractConceptDefinitions(concept, true);
                        break;

                    case REQUEST_TYPE.CHANGE_RETIRE_CONCEPT.value:
                        item.conceptId = concept.conceptId;
                        item.conceptFSN = concept.definitionOfChanges.currentFsn;
                        item.proposedFSN = concept.fsn;
                        item.proposedStatus = definitionOfChanges.proposedStatus;
                        item.historyAttribute = definitionOfChanges.historyAttribute;
                        item.historyAttributeValue = definitionOfChanges.historyAttributeValue;
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
                        break;

                    case REQUEST_TYPE.CHANGE_RETIRE_DESCRIPTION.value:
                        item.conceptId = concept.conceptId;
                        item.conceptFSN = concept.fsn;
                        item.descriptionId = changedTarget.descriptionId;
                        item.currentDescription = changedTarget.term;
                        item.conceptDescription = changedTarget.term;
                        item.proposedDescription = definitionOfChanges.proposedDescription || changedTarget.term;
                        item.proposedCaseSignificance = changedTarget.caseSignificance;
                        item.proposedDescriptionStatus = definitionOfChanges.descriptionStatus;
                        break;

                    case REQUEST_TYPE.NEW_RELATIONSHIP.value:
                        item.conceptId = concept.conceptId;
                        item.relationshipType = changedTarget.type.conceptId;
                        item.destConceptId = changedTarget.target.conceptId;
                        item.characteristicType = definitionOfChanges.characteristicType;
                        item.refinability = definitionOfChanges.refinability;
                        break;

                    case REQUEST_TYPE.CHANGE_RETIRE_RELATIONSHIP.value:
                        item.conceptId = concept.conceptId;
                        item.conceptFSN = concept.fsn;
                        item.relationshipId = changedTarget.relationshipId;
                        item.refinability = definitionOfChanges.refinability;
                        item.relationshipStatus = definitionOfChanges.relationshipStatus;
                        break;
                }

                return item;

            };

            var buildRequestFromRequestData = function (requestData) {
                var request = {
                    id:                 requestData.id,
                    fsn:                requestData.fsn,
                    batchRequest:       requestData.batchRequest,
                    rfcNumber:          requestData.rfcNumber,
                    additionalFields:   requestData.additionalFields || {},
                    jiraTicketId:       requestData.jiraTicketId,
                    requestType:        requestData.requestType,
                    inputMode:          requestData.inputMode,
                    requestHeader:      requestData.requestHeader
                };
                var requestItems = requestData.requestItems;
                var mainItem = extractItemByRequestType(requestItems, requestService.identifyRequestType(request.requestType));

                switch (request.requestType) {
                    case REQUEST_TYPE.NEW_CONCEPT.value:
                        //mainItem = requestItems[0];

                        //parentConcept = identifyParentConcept(concept);
                        request.parentConcept = {
                            conceptId: mainItem.parentId,
                            fsn: mainItem.parentFSN
                        };

                        request.proposedFSN = mainItem.proposedFSN;
                        request.conceptPT = mainItem.conceptPT;
                        request.proposedSynonyms = mainItem.proposedSynonyms;
                        request.proposedDefinitions = mainItem.proposedDefinitions;
                        break;

                    case REQUEST_TYPE.CHANGE_RETIRE_CONCEPT.value:
                        //mainItem = extractItemByRequestType(requestItems, REQUEST_TYPE.CHANGE_RETIRE_CONCEPT);

                        request.proposedFSN = mainItem.proposedFSN;
                        request.proposedStatus = mainItem.proposedStatus;
                        request.historyAttribute = mainItem.historyAttribute;
                        request.historyAttributeValue = mainItem.historyAttributeValue;
                        break;

                    case REQUEST_TYPE.NEW_DESCRIPTION.value:
                        //mainItem = extractItemByRequestType(requestItems, REQUEST_TYPE.NEW_DESCRIPTION);

                        request.proposedDescription = mainItem.proposedDescription;
                        request.descriptionIsPT = mainItem.descriptionIsPT;
                        break;

                    case REQUEST_TYPE.CHANGE_RETIRE_DESCRIPTION.value:
                        //mainItem = extractItemByRequestType(requestItems, REQUEST_TYPE.CHANGE_RETIRE_DESCRIPTION);

                        request.descriptionId = mainItem.descriptionId;
                        request.proposedDescription = mainItem.proposedDescription;
                        request.proposedCaseSignificance = mainItem.proposedCaseSignificance;
                        request.descriptionStatus = mainItem.proposedDescriptionStatus;
                        break;

                    case REQUEST_TYPE.NEW_RELATIONSHIP.value:
                        //mainItem = extractItemByRequestType(requestItems, REQUEST_TYPE.NEW_RELATIONSHIP);

                        request.characteristicType = mainItem.characteristicType;
                        request.refinability = mainItem.refinability;

                        // load destination concept
                        request.destinationConcept = {
                            conceptId: mainItem.destConceptId
                        };

                        // load relationship type
                        snowowlService.getFullConcept(null, null, mainItem.relationshipType).then(function (response) {
                            request.relationshipType = {
                                conceptId: mainItem.relationshipType,
                                fsn: response.fsn
                            };
                        });

                        break;

                    case REQUEST_TYPE.CHANGE_RETIRE_RELATIONSHIP.value:
                        //mainItem = extractItemByRequestType(requestItems, REQUEST_TYPE.CHANGE_RETIRE_RELATIONSHIP);

                        request.relationshipId = mainItem.relationshipId;
                        request.relationshipStatus = mainItem.relationshipStatus;
                        request.refinability = mainItem.refinability;

                        break;
                }

                return request;

            };

            var buildRequestData = function (request, concept) {
                var requestDetails = {};


                requestDetails.inputMode = vm.inputMode.value;
                requestDetails.requestType = vm.requestType.value;

                requestDetails.id = request.id;
                requestDetails.requestItems = [];
                requestDetails.concept = concept;

                //buildRequestAdditionalFields(requestDetails, concept);
                requestDetails.additionalFields = request.additionalFields;
                requestDetails.fsn = concept.fsn;

                // check concept changes
                if (concept.definitionOfChanges && concept.definitionOfChanges.changed === true) {
                    requestDetails.requestItems.push(buildRequestWorkItem(concept, concept.definitionOfChanges));
                }

                if (concept.definitionOfChanges.changeType === REQUEST_TYPE.CHANGE_RETIRE_CONCEPT.value) {
                    angular.forEach(concept.descriptions, function (description) {
                        if (description.definitionOfChanges && description.definitionOfChanges.changed) {
                            requestDetails.requestItems.push(buildRequestWorkItem(concept, description.definitionOfChanges, description));
                        }
                    });

                    angular.forEach(concept.relationships, function (relationship) {
                        if (relationship.definitionOfChanges && relationship.definitionOfChanges.changed) {
                            requestDetails.requestItems.push(buildRequestWorkItem(concept, relationship.definitionOfChanges, relationship));
                        }
                    });
                }

                return requestDetails;
            };

            var buildConceptDefinitionOfChange = function (concept, request) {
                if (!concept.definitionOfChanges) {
                    concept.definitionOfChanges = buildChangeConceptDefinitionOfChanges();
                }

                if (!concept.conceptId) {
                    concept.fsn = extractConceptFSN(concept);
                }

                // build concept additional fields
                concept.definitionOfChanges.topic = request.additionalFields.topic;
                concept.definitionOfChanges.notes = request.additionalFields.notes;
                concept.definitionOfChanges.reference = request.additionalFields.reference;
                concept.definitionOfChanges.reasonForChange = request.additionalFields.reasonForChange;
                concept.definitionOfChanges.currentFsn = concept.fsn;
            };

            var buildConceptFromRequest = function (request) {
                var concept = null, parentConcept;
                if (vm.originalConcept) {
                    concept = angular.copy(vm.originalConcept);

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

                        case REQUEST_TYPE.CHANGE_RETIRE_DESCRIPTION:
                            cloneConceptDescription(concept, request.descriptionId, request.proposedDescription, request.proposedCaseSignificance, true, request.descriptionStatus);
                            break;

                        case REQUEST_TYPE.NEW_RELATIONSHIP:
                            injectRelationship(concept, request.relationshipType, request.destinationConcept, request.characteristicType, request.refinability, true);
                            break;

                        case REQUEST_TYPE.CHANGE_RETIRE_RELATIONSHIP:
                            for (var i = 0; i < concept.relationships.length; i++) {
                                if (concept.relationships[i].relationshipId === request.relationshipId) {
                                    concept.relationships[i].active = false;
                                    concept.relationships[i].definitionOfChanges = {
                                        changeId: null,
                                        changeType: REQUEST_TYPE.CHANGE_RETIRE_RELATIONSHIP.value,
                                        changed: true,
                                        relationshipStatus: request.relationshipStatus,
                                        refinability: request.refinability
                                    };
                                    break;
                                }
                            }
                            break;
                    }
                }

                return concept;
            };

            var validateRequest = function (ignoreGeneralFields) {
                var field, fieldValue, error = {};
                var fieldRequiredLangKey = 'crs.request.message.error.fieldRequired',
                    fieldInvalidLangKey = 'crs.request.message.error.fieldInvalid';

                notificationService.clear();

                // validate concept
                if (vm.originalConcept === undefined || vm.originalConcept === null ||
                    (vm.originalConcept && !vm.originalConcept.moduleId && !vm.originalConcept.conceptId && !vm.originalConcept.fsn)) {
                    error.concept = fieldRequiredLangKey;
                } else if (vm.originalConcept && !vm.originalConcept.moduleId && !vm.originalConcept.conceptId && vm.originalConcept.fsn) {
                    error.concept = fieldInvalidLangKey;
                }

                // test general fields
                if (!ignoreGeneralFields) {
                    if (!vm.request.additionalFields.topic ||
                        !vm.request.additionalFields.topic.trim()) {
                        error.topic = fieldRequiredLangKey;
                    }
                }

                // validate require fields
                if (vm.inputMode === REQUEST_INPUT_MODE.SIMPLE) {
                    for (var i = 0; i < vm.requestType.form.fields.length; i++) {
                        field = vm.requestType.form.fields[i];
                        fieldValue = vm.request[field.name];

                        if (field.required === true &&
                            (fieldValue === undefined ||
                            fieldValue === null ||
                            (angular.isFunction(fieldValue.trim) && fieldValue.trim() === '' ) ||
                            (angular.isObject(fieldValue) && !fieldValue.conceptId ))) {
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

            var saveRequest = function () {
                // requestData
                var requestData;

                if (!validateRequest()) {
                    return;
                }

                // show loading mask
                $rootScope.showAppLoading = true;

                //console.log(vm.request);
                if (vm.inputMode === REQUEST_INPUT_MODE.SIMPLE) {
                    vm.concept = buildConceptFromRequest(vm.request);
                } else if (vm.inputMode === REQUEST_INPUT_MODE.DIRECT) {
                    buildConceptDefinitionOfChange(vm.concept, vm.request);
                }

                requestData = buildRequestData(vm.request, vm.concept);
                //console.log(requestData);

                requestService.saveRequest(requestData)
                    .then(function (response) {
                        notificationService.sendMessage('crs.request.message.requestSaved', 5000);
                        $location.path('/dashboard').search({});
                    }, function (e) {
                        showErrorMessage(e.message)
                    })
                    .finally(function () {
                        $rootScope.showAppLoading = false;
                    });
            };

            var saveAndSubmitRequest = function () {
                // requestData
                var requestData;

                if (!validateRequest()) {
                    return;
                }

                // show loading mask
                $rootScope.showAppLoading = true;

                //console.log(vm.request);
                if (vm.inputMode === REQUEST_INPUT_MODE.SIMPLE) {
                    vm.concept = buildConceptFromRequest(vm.request);
                } else if (vm.inputMode === REQUEST_INPUT_MODE.DIRECT) {
                    buildConceptDefinitionOfChange(vm.concept, vm.request);
                }

                requestData = buildRequestData(vm.request, vm.concept);
                //console.log(requestData);

                requestService.saveRequest(requestData)
                    .then(function (response) {
                        var requestId = response.id;

                        return requestService.submitRequest(requestId);
                    })
                    .then(function (response) {
                        notificationService.sendMessage('crs.request.message.requestSubmitted', 5000);
                        $location.path('/dashboard').search({});
                    }, function (e) {
                        showErrorMessage(e.message)
                    })
                    .finally(function () {
                        $rootScope.showAppLoading = false;
                    });
            };

            var changeRequestStatus = function (requestId, requestStatus, data) {
                // show loading mask
                $rootScope.showAppLoading = true;

                return requestService.changeRequestStatus(requestId, requestStatus, data)
                    .finally(function () {
                        $rootScope.showAppLoading = false;
                    });
            };

            var acceptRequest = function () {
                changeRequestStatus(vm.request.id, REQUEST_STATUS.ACCEPTED)
                    .then(function (response) {
                        notificationService.sendMessage('crs.request.message.requestAccepted', 5000);
                        $location.path('/dashboard').search({});
                    }, function (e) {
                        showErrorMessage(e.message)
                    });
            };

            var rejectRequest = function () {
                var modalInstance = openStatusCommentModal('reject');

                modalInstance.result.then(function (rejectComment) {
                    changeRequestStatus(vm.request.id, REQUEST_STATUS.REJECTED, {reason:rejectComment})
                        .then(function (response) {
                            notificationService.sendMessage('crs.request.message.requestRejected', 5000);
                            $location.path('/dashboard').search({});
                        }, function (e) {
                            showErrorMessage(e.message)
                        });
                });


            };

            var requestClarification = function () {
                changeRequestStatus(vm.request.id, REQUEST_STATUS.CLARIFICATION_NEEDED)
                    .then(function (response) {
                        notificationService.sendMessage('crs.request.message.requestClarification', 5000);
                        $location.path('/dashboard').search({});
                    }, function (e) {
                        showErrorMessage(e.message)
                    });
            };

            var appealRequest = function () {
                var modalInstance = openStatusCommentModal('appeal');

                modalInstance.result.then(function (appealComment) {
                    changeRequestStatus(vm.request.id, REQUEST_STATUS.APPEAL, {reason:appealComment})
                        .then(function (response) {
                            notificationService.sendMessage('crs.request.message.requestAppealed', 5000);
                            $location.path('/dashboard').search({});
                        }, function (e) {
                            showErrorMessage(e.message)
                        });
                });
            };

            var startEditingConcept = function (conceptObj) {
                notificationService.sendMessage('Loading concept ' + (conceptObj.name ? conceptObj.name : conceptObj.id) + ' to edit panel', 10000, null);
                snowowlService.getFullConcept(null, null, conceptObj.id).then(function (response) {
                    notificationService.sendMessage('Concept ' + response.fsn + ' successfully added to edit list', 5000, null);
                    response.definitionOfChanges = buildChangeConceptDefinitionOfChanges();
                    response.definitionOfChanges.currentFsn = response.fsn;
                    vm.originalConcept = response;
                    vm.concept = angular.copy(vm.originalConcept);
                });
            };

            var setInputMode = function (im) {
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

            var onConceptChangedDirectly = function (historyCount) {
                if (!permanentlyDisableSimpleMode) {
                    if (historyCount === 0) {
                        vm.disableSimpleMode = false;
                    } else if (historyCount > 0) {
                        vm.disableSimpleMode = true;
                    }
                }
            };

            var openStatusCommentModal = function (requestStatus) {
                return $uibModal.open({
                    templateUrl: 'components/request/modal-change-request-status.html',
                    controller: 'ModalChangeRequestStatusCtrl as modal',
                    resolve: {
                        requestStatus: function () {
                            return requestStatus;
                        }
                    }
                });
            };


            $scope.$on(CONCEPT_EDIT_EVENT.STOP_EDIT_CONCEPT, function (event, data) {
                if (!data || !data.concept) {
                    console.error('Cannot remove concept: concept must be supplied');
                    return;
                }

                if (data && data.concept.conceptId === vm.concept.conceptId) {
                    vm.originalConcept = null;
                    vm.concept = null;
                }
            });


            $scope.$watch(function () {
                return vm.inputMode;
            }, function (newVal) {
                if (newVal === REQUEST_INPUT_MODE.DIRECT) {
                    vm.inputModePage = 'components/request/request-details-edit-panel.html';
                } else if (newVal === REQUEST_INPUT_MODE.SIMPLE) {
                    vm.inputModePage = vm.requestType.form.template;
                } else {
                    vm.inputModePage = null;
                }
            });


            vm.cancelEditing = cancelEditing;
            vm.saveRequest = saveRequest;
            vm.acceptRequest = acceptRequest;
            vm.rejectRequest = rejectRequest;
            vm.requestClarification = requestClarification;
            vm.saveAndSubmitRequest = saveAndSubmitRequest;
            vm.startEditingConcept = startEditingConcept;
            vm.setInputMode = setInputMode;
            vm.originalConcept = null;
            vm.onConceptChangedDirectly = onConceptChangedDirectly;
            vm.appealRequest = appealRequest;
            vm.error = {};
            vm.conceptStatus = {
                loading: false,
                searching: false,
                valid: true
            };

            $scope.panelId = 'REQUEST_DETAILS';

            initView();
        }
    ]);