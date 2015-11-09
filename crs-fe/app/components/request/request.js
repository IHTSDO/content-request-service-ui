'use strict';

angular
    .module('conceptRequestServiceApp.request', [
    ])
    .value('REQUEST_TYPE',{
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
            form: 'components/request/request-new-description-form.html'
        },
        NEW_RELATIONSHIP: {
            value: 'NEW_RELATIONSHIP',
            langKey: 'crs.request.requestType.newRelationship',
            form: 'components/request/request-new-relationship-form.html'
        },
        CHANGE_RETIRE_CONCEPT: {
            value: 'CHANGE_RETIRE_CONCEPT',
            langKey: 'crs.request.requestType.changeRetireConcept',
            form: 'components/request/request-change-concept-form.html'
        },
        CHANGE_RETIRE_DESCRIPTION: {
            value: 'CHANGE_RETIRE_DESCRIPTION',
            langKey: 'crs.request.requestType.changeRetireDescription',
            form: 'components/request/request-change-description-form.html'
        },
        CHANGE_RETIRE_RELATIONSHIP: {
            value: 'CHANGE_RETIRE_RELATIONSHIP',
            langKey: 'crs.request.requestType.changeRetireRelationship',
            form: 'components/request/request-change-relationship-form.html'
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
    .config(function ($routeProvider) {
        $routeProvider
            .when('/requests/:mode/:param', {
                templateUrl: 'components/request/request-details.html',
                controller: 'RequestDetailsCtrl',
                controllerAs: 'requestVM'
            });
    });