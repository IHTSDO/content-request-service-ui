'use strict';

angular.module('conceptRequestServiceApp.message', [])
    .value('MESSAGE_TYPE', {
        BATCH_IMPORT_STATUS_CHANGE: {
            value: 'BATCH_IMPORT_STATUS_CHANGE',
            titleLangKey: 'crs.notification.message.batchImportStatusChange'
        },
        REQUEST_STATUS_CHANGE: {
            value: 'REQUEST_STATUS_CHANGE',
            titleLangKey: 'crs.notification.message.requestStatusChange'

        },
        BATCH_IMPORT_SUCCESS: {
            value: 'BATCH_IMPORT_SUCCESS',
            titleLangKey: 'crs.notification.message.batchImportSuccess'
        },
        COMMENT_ADDED: {
            value: 'COMMENT_ADDED',
            titleLangKey: 'crs.notification.message.commentAdded'
        },
        BULK_ACTION_COMPLETED: {
            value: 'BULK_ACTION_COMPLETED',
            titleLangKey: 'crs.notification.message.bulkActionCompleted'
        }
    });
