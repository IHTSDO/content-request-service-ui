'use strict';

angular.module('conceptRequestServiceApp.request')
    .service('requestService', [
        '$rootScope',
        '$q',
        'crsService',
        'REQUEST_TYPE',
        'REQUEST_STATUS',
        'CRS_API_ENDPOINT',
        function ($rootScope, $q, crsService, REQUEST_TYPE, REQUEST_STATUS, CRS_API_ENDPOINT) {

            // mock requests
            var requests = [
                {
                    batchId: 367877,
                    id: 337665,
                    fsn: 'Anatomical or acquired body structure',
                    requestType: 'NEW_CONCEPT',
                    status: 'New',
                    modifiedDate: '03-11-2015'
                },
                {
                    batchId: 367877,
                    id: 276815,
                    fsn: 'Inflammatory morphology',
                    requestType: 'NEW_CONCEPT',
                    status: 'In Progress',
                    modifiedDate: '03-11-2015'
                },
                {
                    batchId: 315869,
                    id: 512872,
                    fsn: 'Abnormal cell',
                    requestType: 'CHANGE_RETIRE_CONCEPT',
                    status: 'New',
                    modifiedDate: '02-11-2015'
                },
                {
                    batchId: 315869,
                    id: 510012,
                    fsn: 'Abnormal shape',
                    requestType: 'CHANGE_RETIRE_DESCRIPTION',
                    status: 'Appealed',
                    modifiedDate: '02-11-2015'
                },
                {
                    batchId: 322014,
                    id: 510013,
                    fsn: 'Enlargement',
                    requestType: 'NEW_RELATIONSHIP',
                    status: 'Approved',
                    modifiedDate: '01-11-2015'
                }
            ];

            var identifyRequestType = function (value) {
                for (var requestTypeKey in REQUEST_TYPE) {
                    if (REQUEST_TYPE.hasOwnProperty(requestTypeKey) &&
                        REQUEST_TYPE[requestTypeKey].value === value) {
                        return REQUEST_TYPE[requestTypeKey];
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
                /*var deferred = $q.defer();


                deferred.resolve(requests);

                return deferred.promise;*/
                var listEndpoint = CRS_API_ENDPOINT.REQUEST_LIST;

                return crsService.sendGet(listEndpoint, null, null);
            };

            var getRequest = function (requestId) {
                /*var request = null;
                var deferred = $q.defer();

                angular.forEach(requests, function (item) {
                    if ((item.id + '') === requestId) {
                        request = item;
                    }
                });

                deferred.resolve(request);

                return deferred.promise;*/

                var requestEndpoint = CRS_API_ENDPOINT.REQUEST;
                return crsService.sendGet(requestEndpoint + '/' + requestId, null);
            };

            var saveRequest = function (requestDetails) {
                var requestEndpoint = CRS_API_ENDPOINT.REQUEST;
                var rfcNumber = requestDetails.rfcNumber;

                if (rfcNumber === undefined || rfcNumber === null) {
                    return crsService.sendPost(requestEndpoint, null, requestDetails);
                } else {
                    return crsService.sendPut(requestEndpoint + '/' + rfcNumber, null, requestDetails);
                }
            };

            var submitRequest = function (rfcNumber) {
                var requestEndpoint = CRS_API_ENDPOINT.REQUEST;

                if (rfcNumber !== undefined || rfcNumber !== null) {
                    return crsService.sendPost(requestEndpoint + '/' + rfcNumber + '/submit', null, null);
                }
            };


            return {
                identifyRequestType: identifyRequestType,
                identifyRequestStatus: identifyRequestStatus,
                getRequest: getRequest,
                getRequests: getRequests,
                saveRequest: saveRequest,
                submitRequest: submitRequest
            };

        }]);