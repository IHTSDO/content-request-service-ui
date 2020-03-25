'use strict';

angular
    .module('conceptRequestServiceApp.request', [
    ])
    .value('REQUEST_INPUT_MODE', {
		DIRECT: {
            value: 'DIRECT',
            langKey: 'crs.request.inputMode.direct',
            requestTypes: ['NEW_CONCEPT', 'CHANGE_RETIRE_CONCEPT']
        },
		
        SIMPLE: {
            value: 'SIMPLE',
            langKey: 'crs.request.inputMode.simple',
            requestTypes: ['NEW_CONCEPT', 'NEW_DESCRIPTION', 'NEW_RELATIONSHIP', 'CHANGE_DESCRIPTION', 'CHANGE_RELATIONSHIP', 'RETIRE_DESCRIPTION', 'RETIRE_RELATIONSHIP', 'CHANGE_RETIRE_CONCEPT', 'OTHER']
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
                    // { name: 'proposedDefinitions', required: true},
                    { name: 'value', required: true}
                ]
            }
        },
        NEW_DESCRIPTION: {
            value: 'NEW_DESCRIPTION',
            langKey: 'crs.request.requestType.newDescription',
            form: {
                template: 'components/request/request-new-description-form.html',
                modal: 'components/request/request-new-description-modal.html',
                "fields": [
                    {"name": "requestorInternalId"},
                    {"name": "proposedDescription", "required": true},
                    {"name": "descriptionIsPT"},
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
                    {"name": "refinability"},
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
                    {"name": "historyAttributeValue"},
                ]

            }
        },
        CHANGE_DESCRIPTION: {
            value: 'CHANGE_DESCRIPTION',
            langKey: 'crs.request.requestType.changeRetireDescription',
            form: {
                template: 'components/request/request-change-retire-description-form.html',
                modal: 'components/request/request-change-retire-description-modal.html',
                "fields": [
                    {"name": "requestorInternalId"},
                    {"name": "descriptionId", "required": true},
                    {"name": "proposedDescription"},
                    {"name": "proposedCaseSignificance"},
                    {"name": "proposedDescriptionStatus"},
                ]
            }
        },
        RETIRE_DESCRIPTION: {
            value: 'RETIRE_DESCRIPTION',
            langKey: 'crs.request.requestType.retireDescription',
            form: {
                template: 'components/request/request-retire-description-form.html',
                modal: 'components/request/request-change-retire-description-modal.html',
                "fields": [
                    {"name": "requestorInternalId"},
                    {"name": "descriptionId", "required": true},
                    {"name": "proposedDescription"},
                    {"name": "proposedCaseSignificance"},
                    {"name": "proposedDescriptionStatus"},
                ]
            }
        },
        RETIRE_RELATIONSHIP: {
            value: 'RETIRE_RELATIONSHIP',
            langKey: 'crs.request.requestType.changeRetireRelationship',
            form: {
                template: 'components/request/request-change-retire-relationship-form.html',
                modal: 'components/request/request-change-retire-relationship-modal.html',
                "fields": [
                    {"name": "requestorInternalId"},
                    {"name": "relationshipId", "required": true},
                    {"name": "refinability"},
                    {"name": "relationshipStatus", required: true},
                ]
            }
        },
        CHANGE_RELATIONSHIP: {
            value: 'CHANGE_RELATIONSHIP',
            langKey: 'crs.request.requestType.changeRelationship',
            form: {
                template: 'components/request/request-change-relationship-form.html',
                modal: 'components/request/request-change-retire-relationship-modal.html',
                "fields": [
                    {"name": "requestorInternalId"},
                    {"name": "relationshipId", "required": true},
                    {"name": "refinability"},
                    {"name": "relationshipStatus"},
                ]
            }
        },
        OTHER: {
            value: 'OTHER',
            langKey: 'crs.request.requestType.other',
            form: {
                template: 'components/request/request-other-form.html',
                "fields": [
                    {"name": "requestorInternalId"},
                    {"name": "requestDescription", "required": true},
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
        UNDER_AUTHORING: {
            value: 'UNDER_AUTHORING',
            langKey: 'crs.request.requestStatus.underAuthoring'
        },
        REJECTED: {
            value: 'REJECTED',
            langKey: 'crs.request.requestStatus.rejected'
        },
        CLARIFICATION_NEEDED: {
            value: 'CLARIFICATION_NEEDED',
            langKey: 'crs.request.requestStatus.clarificationNeeded'
        },
        APPEAL: {
            value: 'APPEAL',
            langKey: 'crs.request.requestStatus.appeal'
        },
        ON_HOLD: {
            value: 'ON_HOLD',
            langKey: 'crs.request.requestStatus.onHold'
        },
        WITHDRAWN: {
            value: 'WITHDRAWN',
            langKey: 'crs.request.requestStatus.withdraw'
        },
        APPEAL_REJECTED: {
            value: 'APPEAL_REJECTED',
            langKey: 'crs.request.requestStatus.appealRejected'
        },
        // APPROVED: {
        //     value: 'APPROVED',
        //     langKey: 'crs.request.requestStatus.approved'
        // },
        RELEASED: {
            value: 'RELEASED',
            langKey: 'crs.request.requestStatus.released'
        },
        FORWARDED: {
            value: 'FORWARDED',
            langKey: 'crs.request.requestStatus.forwarded'
        },
        IN_INCEPTION_ELABORATION: {
            value: 'IN_INCEPTION_ELABORATION',
            langKey: 'crs.request.requestStatus.inInceptionElaboration'
        },
        READY_FOR_RELEASE: {
            value: 'READY_FOR_RELEASE',
            langKey: 'crs.request.requestStatus.readyForRelease'
        },
        IN_APPEAL_CLARIFICATION: {
            value: 'IN_APPEAL_CLARIFICATION',
            langKey: 'crs.request.requestStatus.inAppealClarification'
        },
        INTERNAL_INPUT_NEEDED: {
            value: 'INTERNAL_INPUT_NEEDED',
            langKey: 'crs.request.requestStatus.waitingForInternalInput'
        }
    })
    .value('STATISTICS_STATUS',{
        Assigned: {
            value: 'Assigned',
            langKey: 'crs.dashboard.sidebar.assigned'
        },
        ACCEPTED: {
            value: 'ACCEPTED',
            langKey: 'crs.dashboard.sidebar.accepted'
        },
        APPEAL_REJECTED: {
            value: 'APPEAL_REJECTED',
            langKey: 'crs.dashboard.sidebar.appealRejected'
        },
        UNDER_AUTHORING: {
            value: 'UNDER_AUTHORING',
            langKey: 'crs.dashboard.sidebar.underAuthoring'
        },
        CLARIFICATION_NEEDED: {
            value: 'CLARIFICATION_NEEDED',
            langKey: 'crs.dashboard.sidebar.clarificationNeeded'
        },
        RELEASED: {
            value: 'RELEASED',
            langKey: 'crs.dashboard.sidebar.released'
        },
        FORWARDED: {
            value: 'FORWARDED',
            langKey: 'crs.dashboard.sidebar.forwarded'
        },
        NEW: {
            value: 'NEW',
            langKey: 'crs.dashboard.sidebar.new'
        },
        REJECTED: {
            value: 'REJECTED',
            langKey: 'crs.dashboard.sidebar.rejected'
        },
        WITHDRAWN: {
            value: 'WITHDRAWN',
            langKey: 'crs.dashboard.sidebar.withdraw'
        },
        APPEAL: {
            value: 'APPEAL',
            langKey: 'crs.dashboard.sidebar.appeal'
        },
        DRAFT: {
            value: 'DRAFT',
            langKey: 'crs.dashboard.sidebar.draft'
        },
        SUBMITTED: {
            value: 'SUBMITTED',
            langKey: 'crs.dashboard.sidebar.submitted'
        },
        ALL_REQUEST: {
            value: 'ALL_REQUEST',
            langKey: 'crs.dashboard.sidebar.allRequests'
        },
        ALL: {
            value: 'ALL',
            langKey: 'crs.dashboard.sidebar.all'
        },
        Unassigned: {
            value:'Unassigned',
            langKey: 'crs.dashboard.sidebar.unassigned'
        },
		IN_INCEPTION_ELABORATION: {
            value:'IN_INCEPTION_ELABORATION',
            langKey: 'crs.dashboard.sidebar.in_inception_elaboration'
        },
		My_Assigned: {
            value:'My_Assigned',
            langKey: 'crs.dashboard.sidebar.my_assigned'
        },
        READY_FOR_RELEASE: {
            value: 'READY_FOR_RELEASE',
            langKey: 'crs.dashboard.sidebar.readyForRelease'
        },
        IN_APPEAL_CLARIFICATION: {
            value: 'IN_APPEAL_CLARIFICATION',
            langKey: 'crs.dashboard.sidebar.inAppealClarification'
        },
        ON_HOLD: {
            value: 'ON_HOLD',
            langKey: 'crs.request.requestStatus.onHold'
        },
        INTERNAL_INPUT_NEEDED: {
            value: 'INTERNAL_INPUT_NEEDED',
            langKey: 'crs.request.requestStatus.waitingForInternalInput'
        }
    })
    .value('STATISTICS_LABEL',{
        Assigned: {
            value: 'Assigned',
            langKey: 'tooltips.dashboard.sidebar.assigned'
        },
        ACCEPTED: {
            value: 'ACCEPTED',
            langKey: 'tooltips.dashboard.sidebar.accepted'
        },
        APPEAL_REJECTED: {
            value: 'APPEAL_REJECTED',
            langKey: 'tooltips.dashboard.sidebar.appealRejected'
        },
        UNDER_AUTHORING: {
            value: 'UNDER_AUTHORING',
            langKey: 'tooltips.dashboard.sidebar.underAuthoring'
        },
        CLARIFICATION_NEEDED: {
            value: 'CLARIFICATION_NEEDED',
            langKey: 'tooltips.dashboard.sidebar.clarificationNeeded'
        },
        RELEASED: {
            value: 'RELEASED',
            langKey: 'tooltips.dashboard.sidebar.released'
        },
        FORWARDED: {
            value: 'FORWARDED',
            langKey: 'tooltips.dashboard.sidebar.forwarded'
        },
        NEW: {
            value: 'NEW',
            langKey: 'tooltips.dashboard.sidebar.new'
        },
        REJECTED: {
            value: 'REJECTED',
            langKey: 'tooltips.dashboard.sidebar.rejected'
        },
        WITHDRAWN: {
            value: 'WITHDRAWN',
            langKey: 'tooltips.dashboard.sidebar.withdraw'
        },
        APPEAL: {
            value: 'APPEAL',
            langKey: 'tooltips.dashboard.sidebar.appeal'
        },
        DRAFT: {
            value: 'DRAFT',
            langKey: 'tooltips.dashboard.sidebar.draft'
        },
        SUBMITTED: {
            value: 'SUBMITTED',
            langKey: 'tooltips.dashboard.sidebar.submitted'
        },
        ALL_REQUEST: {
            value: 'ALL_REQUEST',
            langKey: 'tooltips.dashboard.sidebar.allRequests'
        },
        ALL: {
            value: 'ALL',
            langKey: 'tooltips.dashboard.sidebar.all'
        },
        Unassigned: {
            value:'Unassigned',
            langKey: 'tooltips.dashboard.sidebar.unassigned'
        },
        IN_INCEPTION_ELABORATION: {
            value:'IN_INCEPTION_ELABORATION',
            langKey: 'tooltips.dashboard.sidebar.in_inception_elaboration'
        },
        My_Assigned: {
            value:'My_Assigned',
            langKey: 'tooltips.dashboard.sidebar.my_assigned'
        },
        IN_APPEAL_CLARIFICATION: {
            value: 'IN_APPEAL_CLARIFICATION',
            langKey: 'crs.dashboard.sidebar.inAppealClarification'
        },
        ON_HOLD: {
            value: 'ON_HOLD',
            langKey: 'crs.request.requestStatus.onHold'
        },
        INTERNAL_INPUT_NEEDED: {
            value: 'INTERNAL_INPUT_NEEDED',
            langKey: 'crs.request.requestStatus.waitingForInternalInput'
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
    .value('BULK_ACTION_STATUS', {
        STATUS_IN_PROGRESS: {
            value: 'IN_PROGRESS',
            langKey: 'crs.request.bulkAction.status.inProgress'
        },
        STATUS_COMPLETED: {
            value: 'COMPLETED',
            langKey: 'crs.request.bulkAction.status.completed'
        },
        STATUS_ERROR: {
            value: 'ERROR',
            langKey: 'crs.request.bulkAction.status.error'
        }
    })
    .value('BULK_ACTION', {
        SUBMIT: {
            value: 'SUBMIT',
            langKey: 'crs.request.bulkAction.action.submit'
        },
        ASSIGN_AUTHOR: {
            value: 'ASSIGN_AUTHOR',
            langKey: 'crs.request.bulkAction.action.assignAuthor'
        },
        ACCEPT_AND_ASSIGN: {
            value: 'ACCEPT_AND_ASSIGN',
            langKey: 'crs.request.bulkAction.action.acceptAndAssign'
        },
        ASSIGN_STAFF: {
            value: 'ASSIGN_MANAGER',
            langKey: 'crs.request.bulkAction.action.assignToStaff'
        },
        ACCEPT: {
            value: 'ACCEPT',
            langKey: 'crs.request.bulkAction.action.accept'
        },
        UNASSIGN_AUTHOR: {
            value: 'UNASSIGN_AUTHOR',
            langKey: 'crs.request.bulkAction.action.unassignAuthor'
        },
        ADD_NOTE: {
            value: 'ADD_NOTE',
            langKey: 'crs.request.bulkAction.action.addNote'
        },
        WITHDRAW: {
            value: 'WITHDRAW',
            langKey: 'crs.request.bulkAction.action.withdraw'
        },
        REJECT: {
            value: 'WITHDRAW',
            langKey: 'crs.request.bulkAction.action.reject'
        },
        CHANGE_REQUESTOR: {
            value: 'CHANGE_REQUESTOR',
            langKey: 'crs.request.bulkAction.action.reassignToRequestor'
        },
        ON_HOLD: {
            value: 'ON_HOLD',
            langKey: 'crs.request.bulkAction.action.onHold'
        },
        INTERNAL_INPUT_NEEDED: {
            value: 'INTERNAL_INPUT_NEEDED',
            langKey: 'crs.request.bulkAction.action.waitingInternalInput'
        },
        FORWARDED: {
            value: 'FORWARDED',
            langKey: 'crs.request.bulkAction.action.forwarded'
        },
        CLARIFICATION_NEEDED: {
            value: 'CLARIFICATION_NEEDED',
            langKey: 'crs.request.bulkAction.action.clarification'
        },
        IN_INCEPTION_ELABORATION: {
            value: 'IN_INCEPTION_ELABORATION',
            langKey: 'crs.request.bulkAction.action.inInceptionElaboration'
        }
    })
    .value('DEFAULT_COLUMNS',{
        myRequests: {
            columns:{
                batchId: true,
                requestId: true,
                concept: true,
                jiraTicketId: true,
                requestor: true,
                createdDate: true,
                modifiedDate: true,
                lastStatusModifier: true,
                type: true,
                topic: true,
                manager: false,
                status: true,
                summary: false,
                trackerId: false,
               forwardDestinationId: false
            }
        },
        myAssignedRequests: {
            columns: {
                batchId: true,
                requestId: true,
                concept: true,
                jiraTicketId: true,
                requestor: true,
                createdDate: true,
                modifiedDate: true,
                lastStatusModifier: true,
                type: true,
                topic: true,
                manager: false,
                status: true,
                summary: false,
                trackerId: false,
                forwardDestinationId: false
            }
        },
        submittedRequests: {
            columns: {
                batchId: true,
                requestId: true,
                concept: true,
                jiraTicketId: true,
                requestor: true,
                createdDate: true,
                modifiedDate: true,
                lastStatusModifier: true,
                type: true,
                topic: true,
                manager: false,
                status: true,
                summary: false,
                trackerId: false,
               forwardDestinationId: false
            }
        },
        acceptedRequests: {
            columns: {
                batchId: true,
                requestId: true,
                concept: true,
                jiraTicketId: true,
                requestor: true,
                createdDate: true,
                modifiedDate: true,
                lastStatusModifier: true,
                type: true,
                topic: true,
                manager: false,
                status: true,
                summary: false,
                assignee: true,
                project: true,
                trackerId: false,
               forwardDestinationId: false
            }
        }
    })
    .config(function ($routeProvider) {
        $routeProvider
            .when('/requests/:mode/:param', {
                templateUrl: 'components/request/request-details.html',
                controller: 'RequestDetailsCtrl',
                controllerAs: 'requestVM',
                resolve: {
                    initConfig : function (configService, $q) {
                        var defer = $q.defer();
                        configService.isConfigLoaded().then(function(){
                          defer.resolve();
                        });                        
                        return defer.promise;
                    }
                }                
            });
    });