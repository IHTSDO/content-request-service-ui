'use strict';

angular.module('conceptRequestServiceApp.dashboard')
    .filter('statisticsLabel', [
        'requestService',
        function (requestService) {
            return function (statisticsLabelValue) {
                var statisticsLabel = requestService.identifyStatisticsLabel(statisticsLabelValue);

                return (statisticsLabel)?statisticsLabel.langKey:'';
            };
        }]);