'use strict';

angular.module('conceptRequestServiceApp.batch')
    .service('batchService', [
        '$rootScope',
        '$q',
        '$http',
        'crsService',
        'configService',
        'CRS_API_ENDPOINT',
        'BATCH_STATUS',
        'BATCH_IMPORT_STATUS',
        function ($rootScope, $q, $http, crsService, configService, CRS_API_ENDPOINT, BATCH_STATUS, BATCH_IMPORT_STATUS) {

            var getBatches = function (page, pageCount, searchStr, sortFields, sortDirections) {
                var listEndpoint = CRS_API_ENDPOINT.BATCH_LIST;
                var params = {
                    offset: page,
                    limit: pageCount,
                    search: searchStr,
                    sortFields: sortFields,
                    sortDirections: sortDirections
                };

                return crsService.sendGet(listEndpoint, params, null);
            };

            var getBatch = function (batchId, page, pageCount, searchStr, sortFields, sortDirections) {
                var requestEndpoint = CRS_API_ENDPOINT.BATCH;
                var params = {
                    offset: page,
                    limit: pageCount,
                    search: searchStr,
                    sortFields: sortFields,
                    sortDirections: sortDirections
                };

                return crsService.sendGet(requestEndpoint + '/' + batchId, params);
            };

            var getBatchSummary = function (batchId) {
                var requestEndpoint = CRS_API_ENDPOINT.BATCH;

                return crsService.sendGet(requestEndpoint + '/' + batchId + '/summary', null);
            };

            var uploadBatchFile = function (batchFile) {
                var batchUploadEndpoint = CRS_API_ENDPOINT.BATCH_UPLOAD;

                return crsService.sendUpload(batchUploadEndpoint, batchFile);
            };

            var importBatch = function (previewBatchId) {
                var batchImportEndpoint = CRS_API_ENDPOINT.BATCH_UPLOADED_PREVIEW + '/' + previewBatchId + '/import';

                return crsService.sendPut(batchImportEndpoint);
            };

            var getUploadedFiles = function (page, pageCount, searchStr, sortFields, sortDirections, ignoreLoadingBar) {
                var uploadedFilesEndpoint = CRS_API_ENDPOINT.BATCH_UPLOADED_LIST;
                var params = {
                    offset: page,
                    limit: pageCount,
                    search: searchStr,
                    sortFields: sortFields,
                    sortDirections: sortDirections
                };

                return crsService.sendGet(uploadedFilesEndpoint, params, ignoreLoadingBar);
            };

            var identifyBatchImportStatus = function (value) {
                for (var statusKey in BATCH_IMPORT_STATUS) {
                    if (BATCH_IMPORT_STATUS.hasOwnProperty(statusKey) &&
                        BATCH_IMPORT_STATUS[statusKey].value === value) {
                        return BATCH_IMPORT_STATUS[statusKey];
                    }
                }
            };

            var identifyBatchStatus = function (value) {
                for (var statusKey in BATCH_STATUS) {
                    if (BATCH_STATUS.hasOwnProperty(statusKey) &&
                        BATCH_STATUS[statusKey].value === value) {
                        return BATCH_STATUS[statusKey];
                    }
                }
            };

            var getImportingRequests = function (batchFileId, requestType) {
                var batchPreviewEndpoint = CRS_API_ENDPOINT.BATCH_UPLOADED_PREVIEW;

                return crsService.sendGet(batchPreviewEndpoint + '/' + batchFileId + '/' + requestType, null, null);
            };

            var downloadConceptsFromBatchRequest = function (batchId) {
                var deferred = $q.defer();
                var crsEndpoint = configService.getEndpointConfig('crs');
                var requestEndpoint = crsEndpoint + CRS_API_ENDPOINT.BATCH;                
                $http({
                    method: 'GET',
                    url: requestEndpoint + '/' + batchId + '/concepts/download',
                    responseType: 'arraybuffer'
                }).then(function (response) {
                    deferred.resolve(response.data);
                }, function () {
                    deferred.resolve(null);
                });

                return deferred.promise;
            };

            var removeBatchPreview = function (batchFileIds) {
                var batchPreviewEndpoint = CRS_API_ENDPOINT.BATCH_UPLOADED_PREVIEW;

                return crsService.sendDelete(batchPreviewEndpoint + '/?ids=' + batchFileIds, null, null);
            };

            var removeBatchRequest= function (batchId) {
                var requestEndpoint = CRS_API_ENDPOINT.BATCH;
                return crsService.sendDelete(requestEndpoint + '/' + batchId, null, null);
            };

            var savedSelectedFiles;

            var setSelectedFiles = function(selectedFiles){
                savedSelectedFiles = selectedFiles;
            };

            var getSelectedFiles = function(){
                return savedSelectedFiles;
            };

            return {
                getBatch: getBatch,
                getBatchSummary: getBatchSummary,
                getBatches: getBatches,
                uploadBatchFile: uploadBatchFile,
                importBatch: importBatch,
                getUploadedFiles: getUploadedFiles,
                identifyBatchStatus: identifyBatchStatus,
                identifyBatchImportStatus: identifyBatchImportStatus,
                getImportingRequests: getImportingRequests,
                removeBatchPreview: removeBatchPreview,
                removeBatchRequest: removeBatchRequest,
                setSelectedFiles: setSelectedFiles,
                getSelectedFiles: getSelectedFiles,
                downloadConceptsFromBatchRequest: downloadConceptsFromBatchRequest
            };

        }]);