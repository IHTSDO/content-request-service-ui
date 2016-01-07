'use strict';

angular.module('conceptRequestServiceApp.batch')
    .filter('batchStatus', [
        'batchService',
        function (batchService) {
            return function (batchStatusValue) {
                var batchStatus = batchService.identifyBatchStatus(batchStatusValue);

                return (batchStatus)?batchStatus.langKey:'';
            }
        }]);