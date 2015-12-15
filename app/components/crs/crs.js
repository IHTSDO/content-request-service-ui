'use strict';

angular
    .module('conceptRequestServiceApp.crs', [
    ])
    .value('CRS_API_ENDPOINT', {
        REQUEST: 'api/request',
        REQUEST_LIST: 'api/request/list',
        SUBMITTED_REQUEST_LIST: 'api/request/list/submitted',
        ACCEPTED_REQUEST_LIST: 'api/request/list/accepted',
        BATCH: 'api/batch',
        BATCH_IMPORT: 'api/batch/import',
        BATCH_UPLOAD: 'api/batch/upload',
        BATCH_UPLOADED_LIST: 'api/batch/upload/preview/list',
        BATCH_UPLOADED_PREVIEW: 'api/batch/upload/preview',
        BATCH_LIST: 'api/batch/list'
    });