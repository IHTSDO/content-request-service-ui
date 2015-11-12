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
        REQUEST_TYPE_INVALID: {code: 10102, message: 'Invalid Request Type'}
    });