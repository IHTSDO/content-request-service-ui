'use strict';

angular
    .module('conceptRequestServiceApp.request', [
    ])
    .value('REQUEST_INPUT_MODE', {
        SIMPLE: {
            value: 'SIMPLE',
            langKey: 'crs.request.inputMode.simple',
            requestTypes: ['NEW_CONCEPT', 'NEW_DESCRIPTION', 'NEW_RELATIONSHIP', 'CHANGE_RETIRE_CONCEPT', 'CHANGE_RETIRE_DESCRIPTION', 'CHANGE_RETIRE_RELATIONSHIP']
        },
        DIRECT: {
            value: 'DIRECT',
            langKey: 'crs.request.inputMode.direct',
            requestTypes: ['NEW_CONCEPT', 'CHANGE_RETIRE_CONCEPT']
        }
    })
    .value('REQUEST_TYPE', {
        NEW_CONCEPT: {
            value: 'NEW_CONCEPT',
            langKey: 'crs.request.requestType.newConcept',
            form: {
                template: 'components/request/request-new-concept-form.html',
                fields: [
                    { name: 'requestorInternalId'},
                    { name: 'proposedFSN', required: true},
                    { name: 'conceptPT', required: true},
                    { name: 'proposedSynonyms'},
                    { name: 'proposedDefinitions'}
                ]
            }
        },
        NEW_DESCRIPTION: {
            value: 'NEW_DESCRIPTION',
            langKey: 'crs.request.requestType.newDescription',
            form: {
                template: 'components/request/request-new-description-form.html',
                "fields": [
                    {"name": "requestorInternalId"},
                    {"name": "proposedDescription", "required": true},
                    {"name": "descriptionIsPT"}
                ]

            }
        },
        NEW_RELATIONSHIP: {
            value: 'NEW_RELATIONSHIP',
            langKey: 'crs.request.requestType.newRelationship',
            form: {
                template: 'components/request/request-new-relationship-form.html',
                modal: 'components/request/request-new-relationship-modal.html',
                "fields": [
                    {"name": "requestorInternalId"},
                    {"name": "relationshipType", "required": true},
                    {"name": "destinationConcept", "required": true},
                    {"name": "characteristicType"},
                    {"name": "refinability"}
                ]
            }
        },
        CHANGE_RETIRE_CONCEPT: {
            value: 'CHANGE_RETIRE_CONCEPT',
            langKey: 'crs.request.requestType.changeRetireConcept',
            form: {
                template: 'components/request/request-change-retire-concept-form.html',
                modal: 'components/request/request-change-retire-concept-modal.html',
                "fields": [
                    {"name": "requestorInternalId"},
                    {"name": "proposedFSN"},
                    {"name": "proposedStatus"},
                    {"name": "historyAttribute"},
                    {"name": "historyAttributeValue"}
                ]

            }
        },
        CHANGE_RETIRE_DESCRIPTION: {
            value: 'CHANGE_RETIRE_DESCRIPTION',
            langKey: 'crs.request.requestType.changeRetireDescription',
            form: {
                template: 'components/request/request-change-retire-description-form.html',
                modal: 'components/request/request-change-retire-description-modal.html',
                "fields": [
                    {"name": "requestorInternalId"},
                    {"name": "descriptionId", "required": true},
                    {"name": "proposedDescription"},
                    {"name": "proposedCaseSignificance"},
                    {"name": "proposedDescriptionStatus"}
                ]
            }
        },
        CHANGE_RETIRE_RELATIONSHIP: {
            value: 'CHANGE_RETIRE_RELATIONSHIP',
            langKey: 'crs.request.requestType.changeRetireRelationship',
            form: {
                template: 'components/request/request-change-retire-relationship-form.html',
                modal: 'components/request/request-change-retire-relationship-modal.html',
                "fields": [
                    {"name": "requestorInternalId"},
                    {"name": "relationshipId", "required": true},
                    {"name": "refinability"},
                    {"name": "relationshipStatus"}
                ]
            }
        }

    })
    .value('REQUEST_STATUS', {
        DRAFT: {
            value: 'DRAFT',
            langKey: 'crs.request.requestStatus.draft'
        },
        NEW: {
            value: 'NEW',
            langKey: 'crs.request.requestStatus.new'
        },
        ACCEPTED: {
            value: 'ACCEPTED',
            langKey: 'crs.request.requestStatus.accepted'
        },
        REJECTED: {
            value: 'REJECTED',
            langKey: 'crs.request.requestStatus.rejected'
        },
        CLARIFICATION_NEEDED: {
            value: 'CLARIFICATION_NEEDED',
            langKey: 'crs.request.requestStatus.clarificationNeeded'
        }
    })
    .value('REQUEST_METADATA_KEY', {
        SOURCE_TERMINOLOGY: 'SOURCE_TERMINOLOGY',
        CASE_SIGNIFICANCE: 'CASE_SIGNIFICANCE',
        RELATIONSHIP_TYPE: 'RELATIONSHIP_TYPE',
        DESTINATION_TERMINOLOGY: 'DESTINATION_TERMINOLOGY',
        CHARACTERISTIC_TYPE: 'CHARACTERISTIC_TYPE',
        REFINABILITY: 'REFINABILITY',
        NEW_CONCEPT_STATUS: 'NEW_CONCEPT_STATUS',
        SEMANTIC_TAG: 'SEMANTIC_TAG',
        CONCEPT_HISTORY_ATTRIBUTE: 'CONCEPT_HISTORY_ATTRIBUTE',
        NEW_DESCRIPTION_STATUS: 'NEW_DESCRIPTION_STATUS',
        NEW_RELATIONSHIP_STATUS: 'NEW_RELATIONSHIP_STATUS'
    })
    .config(function ($routeProvider) {
        $routeProvider
            .when('/requests/:mode/:param', {
                templateUrl: 'components/request/request-details.html',
                controller: 'RequestDetailsCtrl',
                controllerAs: 'requestVM'
            });
    });