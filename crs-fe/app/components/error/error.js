'use strict';

angular
    .module('conceptRequestServiceApp.error', [
    ])
    .value('ERROR_TYPE', {
        HTTP: 0,
        CUSTOM: 1
    })
    .value('CUSTOM_ERROR_DEF', {
        SERVER_ERROR: {code: 10000, message: 'Server error'},
        INVALID_USER: {code: 10101, message: 'Invalid user'},
        USER_NOT_REGISTERED: {code: 10102, message: 'User is not registered'}
    });