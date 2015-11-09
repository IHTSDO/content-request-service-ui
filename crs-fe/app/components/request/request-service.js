'use strict';

angular.module('conceptRequestServiceApp.request')
    .service('requestService', [
        '$rootScope',
        '$q',
        'REQUEST_TYPE',
        function ($rootScope, $q, REQUEST_TYPE) {

            // mock requests
            var requests = [
                {
                    batchId: 367877,
                    id: 337665,
                    fsn: 'Anatomical or acquired body structure',
                    requestType: 'New Concept',
                    status: 'New',
                    modifiedDate: '03-11-2015'
                },
                {
                    batchId: 367877,
                    id: 276815,
                    fsn: 'Inflammatory morphology',
                    requestType: 'New Concept',
                    status: 'In Progress',
                    modifiedDate: '03-11-2015'
                },
                {
                    batchId: 315869,
                    id: 512872,
                    fsn: 'Abnormal cell',
                    requestType: 'Retire Concept',
                    status: 'New',
                    modifiedDate: '02-11-2015'
                },
                {
                    batchId: 315869,
                    id: 510012,
                    fsn: 'Abnormal shape',
                    requestType: 'Change Description',
                    status: 'Appealed',
                    modifiedDate: '02-11-2015'
                },
                {
                    batchId: 322014,
                    id: 510013,
                    fsn: 'Enlargement',
                    requestType: 'New Relationship',
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

            var getRequests = function () {
                var deferred = $q.defer();


                deferred.resolve(requests);

                return deferred.promise;
            };

            var getRequest = function (requestId) {
                var request = null;
                var deferred = $q.defer();

                angular.forEach(requests, function (item) {
                    if ((item.id + '') === requestId) {
                        request = item;
                    }
                });

                deferred.resolve(request);

                return deferred.promise;;
            };

            return {
                identifyRequestType: identifyRequestType,
                getRequest: getRequest,
                getRequests: getRequests
            };

        }]);