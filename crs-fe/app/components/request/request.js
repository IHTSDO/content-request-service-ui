'use strict';

angular
    .module('conceptRequestServiceApp.request', [
    ])
    .value('REQUEST_TYPE', {
        NEW_CONCEPT: {
            value: 'NEW_CONCEPT',
            langKey: 'crs.request.requestType.newConcept',
            form: {
                template: 'components/request/request-new-concept-form.html',
                fields: [
                    { name: 'requestorInternalId'},
                    { name: 'parentId'},
                    { name: 'proposedFSN', required: true},
                    { name: 'conceptPT', required: true},
                    { name: 'proposedSynonym'},
                    { name: 'proposedDefinition'},
                    { name: 'reasonForChange'},
                    { name: 'notes'},
                    { name: 'reference'}
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
                    {"name": "conceptId", "required": true},
                    {"name": "proposedFSN", "required": true},
                    {"name": "proposedDescription", "required": true},
                    {"name": "descriptionIsPT"},
                    {"name": "reasonForChange"},
                    {"name": "notes"},
                    {"name": "reference"}
                ]

            }
        },
        NEW_RELATIONSHIP: {
            value: 'NEW_RELATIONSHIP',
            langKey: 'crs.request.requestType.newRelationship',
            form: {
                template: 'components/request/request-new-relationship-form.html',
                "fields": [
                    {"name": "requestorInternalId"},
                    {"name": "conceptId", "required": true},
                    {"name": "relationshipType", "required": true},
                    {"name": "destConceptId", "required": true},
                    {"name": "characteristicType"},
                    {"name": "refinability"},
                    {"name": "relationshipGroup"},
                    {"name": "reasonForChange"},
                    {"name": "notes"},
                    {"name": "reference"}
                ]
            }
        },
        CHANGE_RETIRE_CONCEPT: {
            value: 'CHANGE_RETIRE_CONCEPT',
            langKey: 'crs.request.requestType.changeRetireConcept',
            form: {
                template: 'components/request/request-change-retire-concept-form.html',
                "fields": [
                    {"name": "requestorInternalId"},
                    {"name": "conceptId", "required": true},
                    {"name": "conceptFSN", "required": true},
                    {"name": "proposedFSN"},
                    {"name": "proposedStatus"},
                    {"name": "historyAttribute"},
                    {"name": "historyAttributeValue"},
                    {"name": "reasonForChange"},
                    {"name": "notes"},
                    {"name": "reference"}
                ]

            }
        },
        CHANGE_RETIRE_DESCRIPTION: {
            value: 'CHANGE_RETIRE_DESCRIPTION',
            langKey: 'crs.request.requestType.changeRetireDescription',
            form: {
                template: 'components/request/request-change-retire-description-form.html',
                "fields": [
                    {"name": "requestorInternalId"},
                    {"name": "conceptId", "required": true},
                    {"name": "conceptFSN", "required": true},
                    {"name": "descriptionId", "required": true},
                    {"name": "description", "required": true},
                    {"name": "proposedDescription"},
                    {"name": "proposedCaseSignificance"},
                    {"name": "proposedDescriptionStatus"},
                    {"name": "reasonForChange"},
                    {"name": "notes"},
                    {"name": "reference"}
                ]
            }
        },
        CHANGE_RETIRE_RELATIONSHIP: {
            value: 'CHANGE_RETIRE_RELATIONSHIP',
            langKey: 'crs.request.requestType.changeRetireRelationship',
            form: {
                template: 'components/request/request-change-retire-relationship-form.html',
                "fields": [
                    {"name": "requestorInternalId"},
                    {"name": "conceptId", "required": true},
                    {"name": "conceptFSN", "required": true},
                    {"name": "relationshipId", "required": true},
                    {"name": "refinability"},
                    {"name": "relationshipStatus"},
                    {"name": "reasonForChange"},
                    {"name": "notes"},
                    {"name": "reference"}
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
        }
    })
    .value('REQUEST_METADATA_KEY', {
        CASE_SIGNIFICANCE: 'CASE_SIGNIFICANCE',
        SOURCE_TERMINOLOGY: 'SOURCE_TERMINOLOGY',
        RELATIONSHIP_TYPE: 'RELATIONSHIP_TYPE',
        CHARACTERISTIC_TYPE: 'CHARACTERISTIC_TYPE',
        REFINABILITY: 'REFINABILITY',
        CHANGE_CONCEPT_STATUS_TO: 'CHANGE_CONCEPT_STATUS_TO',
        SEMANTIC_TAG: 'SEMANTIC_TAG'
    })
    .config(function ($routeProvider) {
        $routeProvider
            .when('/requests/:mode/:param', {
                templateUrl: 'components/request/request-details.html',
                controller: 'RequestDetailsCtrl',
                controllerAs: 'requestVM'
            });
    });