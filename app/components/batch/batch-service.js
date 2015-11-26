'use strict';

angular.module('conceptRequestServiceApp.batch')
    .service('batchService', [
        '$rootScope',
        '$q',
        'crsService',
        'CRS_API_ENDPOINT',
        function ($rootScope, $q, crsService, CRS_API_ENDPOINT) {

            // mock batches
            /*var batches = [
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
            ];*/

            /*var getBatches = function () {
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
            };*/

            var getBatches = function () {
                var listEndpoint = CRS_API_ENDPOINT.BATCH_LIST;

                return crsService.sendGet(listEndpoint, null, null);
            };

            var getBatch = function (batchId) {

                var requestEndpoint = CRS_API_ENDPOINT.BATCH;
                return crsService.sendGet(requestEndpoint + '/' + batchId, null);
            };

            var uploadBatchFile = function (batchFile) {
                var batchImportEndpoint = CRS_API_ENDPOINT.BATCH_IMPORT;

                return crsService.sendUpload(batchImportEndpoint, batchFile);
            };

            return {
                getBatch: getBatch,
                getBatches: getBatches,
                uploadBatchFile: uploadBatchFile
            };

        }]);