'use strict';

angular.module('conceptRequestServiceApp.batch')
    .service('batchService', [
        '$rootScope',
        '$q',
        'crsService',
        'CRS_API_ENDPOINT',
        'BATCH_IMPORT_STATUS',
        function ($rootScope, $q, crsService, CRS_API_ENDPOINT, BATCH_IMPORT_STATUS) {

            var getBatches = function () {
                var listEndpoint = CRS_API_ENDPOINT.BATCH_LIST;

                return crsService.sendGet(listEndpoint, null, null);
            };

            var getBatch = function (batchId) {

                var requestEndpoint = CRS_API_ENDPOINT.BATCH;
                return crsService.sendGet(requestEndpoint + '/' + batchId, null);
            };

            var uploadBatchFile = function (batchFile) {
                var batchImportEndpoint = CRS_API_ENDPOINT.BATCH_UPLOAD;

                return crsService.sendUpload(batchImportEndpoint, batchFile);
            };

            var getUploadedFiles = function () {
                var uploadedFilesEndpoint = CRS_API_ENDPOINT.BATCH_UPLOADED_LIST;

                return crsService.sendGet(uploadedFilesEndpoint, null, null);
            };

            var identifyBatchImportStatus = function (value) {
                for (var statusKey in BATCH_IMPORT_STATUS) {
                    if (BATCH_IMPORT_STATUS.hasOwnProperty(statusKey) &&
                        BATCH_IMPORT_STATUS[statusKey].value === value) {
                        return BATCH_IMPORT_STATUS[statusKey];
                    }
                }
            };

            var getImportingRequests = function (batchFileId, requestType) {
                var batchPreviewEndpoint = CRS_API_ENDPOINT.BATCH_UPLOADED_PREVIEW;

                return crsService.sendGet(batchPreviewEndpoint + '/' + batchFileId + '/' + requestType, null, null);
            };

            return {
                getBatch: getBatch,
                getBatches: getBatches,
                uploadBatchFile: uploadBatchFile,
                getUploadedFiles: getUploadedFiles,
                identifyBatchImportStatus: identifyBatchImportStatus,
                getImportingRequests: getImportingRequests
            };

        }]);