'use strict';

angular.module('conceptRequestServiceApp.request')
    .filter('requestType', [
        'requestService',
        function (requestService) {
            return function (requestTypeValue) {
                var requestType = requestService.identifyRequestType(requestTypeValue);

                return (requestType !== null)?requestType.langKey:'';
            };
        }]);