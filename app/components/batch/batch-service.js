'use strict';

angular.module('conceptRequestServiceApp.batch')
    .service('batchService', [
        '$rootScope',
        '$q',
        function ($rootScope, $q) {

            // mock batches
            var batches = [
                {
                    id: 367877,
                    status: 'Draft',
                    uploadedDate: '03-11-2015',
                    modifiedDate: '03-11-2015',
                    submittedDate: 'N/A'
                },
                {
                    id: 315869,
                    status: 'Submitted',
                    uploadedDate: '01-11-2015',
                    modifiedDate: '02-11-2015',
                    submittedDate: '03-11-2015'
                },
                {
                    id: 322014,
                    status: 'Submitted',
                    uploadedDate: '01-11-2015',
                    modifiedDate: '02-11-2015',
                    submittedDate: '03-11-2015'
                }
            ];

            var getBatches = function () {
                var deferred = $q.defer();


                deferred.resolve(batches);

                return deferred.promise;
            };

            var getBatch = function (batchId) {
                var batch = null;
                var deferred = $q.defer();

                angular.forEach(batches, function (item) {
                    if ((item.id + '') === batchId) {
                        batch = item;
                    }
                });

                deferred.resolve(batch);

                return deferred.promise;
            };

            return {
                getBatch: getBatch,
                getBatches: getBatches
            };

        }]);