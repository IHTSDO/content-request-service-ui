'use strict';

angular.module('conceptRequestServiceApp.message', [])
    .value('MESSAGE_TYPE', {
        BATCH_IMPORT_STATUS_CHANGE: {
            value: 'BATCH_IMPORT_STATUS_CHANGE',
            titleLangKey: 'Batch file status has been changed'
        },
        REQUEST_STATUS_CHANGE: {
            value: 'REQUEST_STATUS_CHANGE',
            titleLangKey: 'Request status has been changed'

        },
        BATCH_IMPORT_SUCCESS: {
            value: 'BATCH_IMPORT_SUCCESS',
            titleLangKey: 'Batch requests have been imported successfully'
        }
    });
