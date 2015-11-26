'use strict';

angular.module('conceptRequestServiceApp.request')
    .service('requestService', [
        '$rootScope',
        '$q',
        'crsService',
        'REQUEST_TYPE',
        'GENERAL_REQUEST_TYPE',
        'REQUEST_STATUS',
        'CRS_API_ENDPOINT',
        function ($rootScope, $q, crsService, REQUEST_TYPE, GENERAL_REQUEST_TYPE, REQUEST_STATUS, CRS_API_ENDPOINT) {

            var identifyRequestType = function (value) {
                for (var requestTypeKey in REQUEST_TYPE) {
                    if (REQUEST_TYPE.hasOwnProperty(requestTypeKey) &&
                        REQUEST_TYPE[requestTypeKey].value === value) {
                        return REQUEST_TYPE[requestTypeKey];
                    }
                }

                return null;
            };

            var identifyGeneralRequestType = function (value) {
                for (var generalRequestTypeKey in GENERAL_REQUEST_TYPE) {
                    if (GENERAL_REQUEST_TYPE.hasOwnProperty(generalRequestTypeKey) &&
                        GENERAL_REQUEST_TYPE[generalRequestTypeKey].value === value) {
                        return GENERAL_REQUEST_TYPE[generalRequestTypeKey];
                    }
                }

                return null;
            };


            var identifyRequestStatus = function (value) {
                for (var requestStatusKey in REQUEST_STATUS) {
                    if (REQUEST_STATUS.hasOwnProperty(requestStatusKey) &&
                        REQUEST_STATUS[requestStatusKey].value === value) {
                        return REQUEST_STATUS[requestStatusKey];
                    }
                }

                return null;
            };

            var getRequests = function () {
                var listEndpoint = CRS_API_ENDPOINT.REQUEST_LIST;

                return crsService.sendGet(listEndpoint, null, null);
            };

            var getSubmittedRequests = function () {
                var listEndpoint = CRS_API_ENDPOINT.SUBMITTED_REQUEST_LIST;

                return crsService.sendGet(listEndpoint, null, null);
            };

            var getRequest = function (requestId) {

                var requestEndpoint = CRS_API_ENDPOINT.REQUEST;
                return crsService.sendGet(requestEndpoint + '/' + requestId, null);
            };

            var saveRequest = function (requestDetails) {
                var requestEndpoint = CRS_API_ENDPOINT.REQUEST;
                var id = requestDetails.id;

                if (id === undefined || id === null) {
                    return crsService.sendPost(requestEndpoint, null, requestDetails);
                } else {
                    return crsService.sendPut(requestEndpoint + '/' + id, null, requestDetails);
                }
            };

            var submitRequest = function (requestId) {
                var requestEndpoint = CRS_API_ENDPOINT.REQUEST;

                if (requestId !== undefined || requestId !== null) {
                    return crsService.sendPost(requestEndpoint + '/' + requestId + '/submit', null, null);
                }
            };


            return {
                identifyRequestType: identifyRequestType,
                identifyGeneralRequestType: identifyGeneralRequestType,
                identifyRequestStatus: identifyRequestStatus,
                getRequest: getRequest,
                getRequests: getRequests,
                getSubmittedRequests: getSubmittedRequests,
                saveRequest: saveRequest,
                submitRequest: submitRequest
            };

        }]);