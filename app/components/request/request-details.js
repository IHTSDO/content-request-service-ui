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
        'REQUEST_TYPE',
        'CONCEPT_EDIT_EVENT',
        'REQUEST_STATUS',
        'REQUEST_INPUT_MODE',
        function ($scope, $rootScope, $routeParams, $location, $anchorScroll, requestService, notificationService, requestMetadataService, objectService, snowowlService, snowowlMetadataService, REQUEST_METADATA_KEY, REQUEST_TYPE, CONCEPT_EDIT_EVENT, REQUEST_STATUS, REQUEST_INPUT_MODE) {
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
                param = $routeParams.param,
                inputMode = $routeParams.inputMode;

            var requestId,
                requestType;

            var originalConcept;

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
                if (pageMode === REQUEST_MODE.NEW) {
                    isValidParam = (requestService.identifyRequestType(param) !== null);
                    isValidInputMode = (identifyInputMode(inputMode) !== null);
                } else if (pageMode === REQUEST_MODE.EDIT) {
                    isValidParam = (param !== undefined && param !== null);
                    isValidInputMode = true;
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

            /*var getDescriptionsForValueTypeahead = function (viewVal) {
                if (vm.orig)
            };*/

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
                    changed: false
                }
            };

            var initView = function () {
                var isValid = isValidViewParams();
                var originConcept;

                if (!isValid) {
                    showErrorMessage('crs.request.message.error.invalidPage');
                } else {
                    if (mode === REQUEST_MODE.NEW.value) {
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

                            /*vm.concept = angular.copy(originalConcept);
                            vm.concept.definitionOfChanges = buildNewConceptDefinitionOfChanges();*/
                        }

                        vm.requestType = requestType;
                        vm.isValidViewParams = isValid;
                        vm.inputMode = identifyInputMode(inputMode);
                    } else if (mode === REQUEST_MODE.EDIT.value) {
                        requestId = param;
                        $rootScope.pageTitles = ['crs.request.details.title.edit'];

                        $rootScope.showLoading = true;
                        loadRequest().then(function () {
                            var requestType = requestService.identifyRequestType(vm.request.requestType);
                            var inputMode = identifyInputMode(vm.request.inputMode);

                            if (requestType) {
                                $rootScope.pageTitles.push(vm.request.id);
                                vm.requestType = requestType;
                                vm.inputMode = inputMode;
                                vm.isValidViewParams = isValid;

                                notificationService.sendMessage('crs.request.message.requestLoaded', 5000);
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
                var originConcept;

                notificationService.sendMessage('crs.request.message.requestLoading', 0);

                vm.request = null;

                return requestService.getRequest(requestId).then(function (requestData) {


                    vm.concept = requestData.concept;
                    vm.request = buildRequestFromRequestData(requestData);

                    // get original concept
                    if (requestData.requestType === REQUEST_TYPE.NEW_CONCEPT.value) {
                        originConcept = objectService.getNewConcept();
                        originConcept.definitionOfChanges = buildNewConceptDefinitionOfChanges();
                        vm.originalConcept = originConcept;
                        return null;
                    } else {
                        vm.originalConcept = {
                            conceptId: requestData.concept.conceptId
                        };
                        /*return snowowlService.getFullConcept(null, null, requestData.concept.conceptId).then(function (response) {
                            originalConcept = response;
                            vm.originalConcept = response;
                        });*/
                    }
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

            var cloneConceptDescription = function (concept, sourceDescription, proposedTerm, proposedCaseSignificance, applyChanges, descriptionStatus) {
                var newDesc = angular.copy(sourceDescription), sourceDesc;

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
                    for (var i = 0; i < concept.descriptions.length; i++) {
                        sourceDesc = concept.descriptions[i];

                        if (sourceDesc.descriptionId === sourceDescription.descriptionId) {
                            sourceDesc.active = false;
                            sourceDesc.definitionOfChanges = {
                                changeId: null,
                                changeType: REQUEST_TYPE.CHANGE_RETIRE_DESCRIPTION.value,
                                changed: true,
                                descriptionStatus: descriptionStatus
                            };

                            break;
                        }
                    }
                }

                concept.descriptions.push(newDesc);
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
                        item.conceptFSN = concept.fsn;
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
                        item.proposedDescription = changedTarget.term;
                        item.caseSignificances = changedTarget.caseSignificance;
                        item.descriptionStatus = definitionOfChanges.descriptionStatus;
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
                    additionalFields:   requestData.additionalFields,
                    jiraTicketId:       requestData.jiraTicketId,
                    requestType:        requestData.requestType,
                    inputMode:          requestData.inputMode,
                    requestHeader:      requestData.requestHeader
                };
                var requestItems = requestData.requestItems,
                    mainItem, secondaryItem;

                switch (request.requestType) {
                    case REQUEST_TYPE.NEW_CONCEPT.value:
                        mainItem = requestItems[0];

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

                    /*case REQUEST_TYPE.CHANGE_RETIRE_CONCEPT.value:
                        item.conceptId = concept.conceptId;
                        item.conceptFSN = concept.fsn;
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
                        item.proposedDescription = changedTarget.term;
                        item.caseSignificances = changedTarget.caseSignificance;
                        item.descriptionStatus = definitionOfChanges.descriptionStatus;
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
                        break;*/
                }


                /*var item = {};
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
                        item.proposedSynonyms = extractConceptSynonyms(concept, true);
                        item.proposedDefinitions = extractConceptDefinitions(concept, true);
                        break;

                    case REQUEST_TYPE.CHANGE_RETIRE_CONCEPT.value:
                        item.conceptId = concept.conceptId;
                        item.conceptFSN = concept.fsn;
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
                        item.proposedDescription = changedTarget.term;
                        item.caseSignificances = changedTarget.caseSignificance;
                        item.descriptionStatus = definitionOfChanges.descriptionStatus;
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

                return item;*/
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

            var buildConceptFromRequest = function (request, applyChanges) {
                var concept = null;
                if (originalConcept) {
                    concept = angular.copy(originalConcept);

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

                    // apply changes from request to concept
                    if (applyChanges === true) {
                        switch (vm.requestType) {
                            case REQUEST_TYPE.NEW_CONCEPT:
                                concept.descriptions = [];
                                concept.relationships = [];
                                concept.fsn = request.proposedFSN;
                                if (request.parentConcept) {
                                    injectParentConcept(concept, request.parentConcept);
                                }

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
                                cloneConceptDescription(concept, request.description, request.proposedDescription, request.proposedCaseSignificance, true, request.descriptionStatus);
                                break;

                            case REQUEST_TYPE.NEW_RELATIONSHIP:
                                injectRelationship(concept, request.relationshipType, request.destinationConcept, request.characteristicType, request.refinability, true);
                                break;

                            case REQUEST_TYPE.CHANGE_RETIRE_RELATIONSHIP:
                                for (var i = 0; i < concept.relationships.length; i++) {
                                    if (concept.relationships[i].id === request.relationship.id) {
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
                }

                return concept;
            };

            var saveRequest = function () {
                // requestData
                var requestData;

                // request must have concept
                if (vm.concept === undefined || vm.concept === null) {
                    showErrorMessage('crs.request.message.error.requiredConcept');
                    return;
                }

                //console.log(vm.request);
                vm.concept = buildConceptFromRequest(vm.request, (vm.inputMode === REQUEST_INPUT_MODE.SIMPLE));
                requestData = buildRequestData(vm.request, vm.concept);

                console.log(requestData);

                requestService.saveRequest(requestData)
                    .then(function (response) {
                        notificationService.sendMessage('crs.request.message.requestSaved', 5000);
                        $location.path('/dashboard').search({});
                    }, function (e) {
                        showErrorMessage(e.message)
                    });
            };

            var saveAndSubmitRequest = function () {
                var requestDetails = buildRequestData(vm.request, vm.concept);

                requestService.saveRequest(requestDetails)
                    .then(function (response) {
                        var requestId = response.id;

                        return requestService.submitRequest(requestId);
                    })
                    .then(function (response) {
                        notificationService.sendMessage('crs.request.message.requestSubmitted', 5000);
                        $location.path('/dashboard').search({});
                    }, function (e) {
                        showErrorMessage(e.message)
                    });
            };

            var startEditingConcept = function (conceptObj) {
                notificationService.sendMessage('Loading concept ' + (conceptObj.name ? conceptObj.name : conceptObj.id) + ' to edit panel', 10000, null);
                snowowlService.getFullConcept(null, null, conceptObj.id).then(function (response) {
                    notificationService.sendMessage('Concept ' + response.fsn + ' successfully added to edit list', 5000, null);
                    response.definitionOfChanges = buildChangeConceptDefinitionOfChanges();
                    originalConcept = response;
                    vm.concept = angular.copy(originalConcept);
                });
            };

            var setInputMode = function (im) {
                var imObj = identifyInputMode(im);

                if (imObj !== null && imObj !== vm.inputMode) {
                    vm.inputMode = imObj;
                }
            };

            $scope.$on(CONCEPT_EDIT_EVENT.STOP_EDIT_CONCEPT, function (event, data) {
                if (!data || !data.concept) {
                    console.error('Cannot remove concept: concept must be supplied');
                    return;
                }

                if (data && data.concept.conceptId === vm.concept.conceptId) {
                    originalConcept = null;
                    vm.concept = null;
                }
            });


            $scope.$watch(function () {
                return vm.inputMode;
            }, function (newVal) {
                if (newVal === REQUEST_INPUT_MODE.DIRECT) {
                    vm.concept = buildConceptFromRequest(vm.request, true);
                    vm.inputModePage = 'components/request/request-details-edit-panel.html';
                } else if (newVal === REQUEST_INPUT_MODE.SIMPLE) {
                    vm.inputModePage = vm.requestType.form.template;
                } else {
                    vm.inputModePage = null;
                }
            });

            $scope.$watch(function () {
                return vm.originalConcept;
            }, function (newVal) {
                originalConcept = newVal;
                vm.concept = angular.copy(originalConcept);
            });

            vm.cancelEditing = cancelEditing;
            vm.saveRequest = saveRequest;
            vm.saveAndSubmitRequest = saveAndSubmitRequest;
            vm.startEditingConcept = startEditingConcept;
            vm.setInputMode = setInputMode;
            vm.originalConcept = null;
            //vm.getDescriptionsForValueTypeahead = getDescriptionsForValueTypeahead;
            //vm.onSelectConcept = onSelectConcept;

            $scope.panelId = 'REQUEST_DETAILS';

            initView();
        }
    ]);