'use strict';

angular.module('conceptRequestServiceApp.dashboard')
    .filter('statisticsStatus', [
        'requestService',
        function (requestService) {
            return function (statisticsStatusValue) {
                var statisticsStatus = requestService.identifyStatisticsStatus(statisticsStatusValue);

                return (statisticsStatus)?statisticsStatus.langKey:'';
            };
        }]);