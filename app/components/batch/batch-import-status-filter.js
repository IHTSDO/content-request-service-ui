'use strict';

angular.module('conceptRequestServiceApp.batch')
    .filter('batchImportStatus', [
        'batchService',
        function (batchService) {
            return function (val) {
                var batchImportStatus = batchService.identifyBatchImportStatus(val);

                return (batchImportStatus !== null)?batchImportStatus.langKey:'';
            }
        }]);