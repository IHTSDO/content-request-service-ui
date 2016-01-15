'use strict';

angular
    .module('conceptRequestServiceApp.error', [
    ])
    .value('ERROR_TYPE', {
        HTTP: 0,
        CUSTOM: 1
    })
    .value('CUSTOM_ERROR_DEF', {
        SERVER_RUNTIME_ERROR: {code: 10000, message: 'Server runtime error'},
        REQUEST_REQUIRED_FIELD_MISSING: {code: 10100, message: 'Missing required field(s)'},
        REQUEST_INVALID: {code: 10101, message: 'Invalid Request'},
        REQUEST_TYPE_INVALID: {code: 10102, message: 'Invalid Request Type'},
        BATCH_REQUEST_INVALID: {code: 10200, message: "Invalid Batch Request"},
        BATCH_REQUEST_IMPORT_INVALID: {code: 10300, message: "Invalid Batch Preview"},
        PARENT_CONCEPT_NOT_EXISTS: {code: 10103, message: "Parent Concept is invalid"},
        CONCEPT_NOT_EXISTS: {code: 10104, message: "Concept ID is invalid"},
        CONCEPT_ID_FSN_NOT_MATCH: {code: 10105, message: "Concept ID and Concept FSN do not match"},
        TARGET_CONCEPT_INVALID: {code: 10106, message: "Target Concept ID is invalid"},
        RELATIONSHIP_TYPE_INVALID: {code: 10107, message: "Relationship Type is invalid"},
        DESCRIPTION_NOT_EXISTS: {code: 10108, message: "Description ID is invalid"},
        DESCRIPTION_ID_TERM_NOT_MATCH: {code: 10109, message: "Description ID and Description do not match"},
        RELATIONSHIP_NOT_EXISTS: {code: 10110, message: "Relationship ID is invalid"},
        REQUEST_FAILED_TO_DELETE_NOT_DRAFT: {code: 10111, message: "Failed to delete request. Only DRAFT requests can be deleted"},
        REQUEST_STATUS_TRANSITION_INVALID: {code: 10112, message: "Cannot update new status from current status"},
        REQUEST_STATUS_INVALID: {code: 10113, message: "Invalid Request Status"},
        REQUEST_STATUS_CHANGE_REASON_MISSING: {code: 10114, message: "Missing Status Reason"}
    })
    .value('HTTP_ERROR_DEF', {
        INTERNAL_SERVER_ERROR: {code: 500, message: 'Internal server error'},
        UNAUTHORIZED: {code: 401, message: 'Unathorized'},
        FORBIDDEN: {code: 403, message: 'Forbidden'}
    });