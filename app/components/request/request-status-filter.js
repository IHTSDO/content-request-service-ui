'use strict';

angular.module('conceptRequestServiceApp.request')
    .filter('requestStatus', [
        'requestService',
        function (requestService) {
            return function (requestStatusValue) {
                var requestStatus = requestService.identifyRequestStatus(requestStatusValue);

                return (requestStatus !== null)?requestStatus.langKey:'';
            }
        }]);