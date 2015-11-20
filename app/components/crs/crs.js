'use strict';

angular
    .module('conceptRequestServiceApp.crs', [
    ])
    .value('CRS_API_ENDPOINT', {
        REQUEST: 'api/request',
        REQUEST_LIST: 'api/request/list',
        SUBMITTED_REQUEST_LIST: 'api/request/list/submitted'
    });