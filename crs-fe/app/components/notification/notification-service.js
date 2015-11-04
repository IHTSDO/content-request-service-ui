'use strict';

angular.module('conceptRequestServiceApp.notification', [])
    .service('notificationService', ['$rootScope', function ($rootScope) {

        var NOTIFICATION_EVENT = 'crs:notification',
            CLEAR_NOTIFICATION_EVENT = 'crs:clearNotifications';

        // force a notification to be sent from elsewhere in the app
        // simple broadcast, but ensures event text is uniform
        function sendMessage(message, durationInMs, url) {

            if (!message || message.length === 0) {
                console.error('Cannot send empty application notification');
            }

            var notification = {
                type: 'MESSAGE',
                message: message,
                url: url,
                durationInMs: durationInMs
            };
            $rootScope.$broadcast(NOTIFICATION_EVENT, notification);
        }

        function sendWarning(message, durationInMs, url) {

            if (!message || message.length === 0) {
                console.error('Cannot send empty application notification');
            }

            var notification = {
                type: 'WARNING',
                message: message,
                url: url,
                durationInMs: durationInMs
            };
            $rootScope.$broadcast(NOTIFICATION_EVENT, notification);
        }

        function sendError(message, durationInMs, url, time) {

            if (!message || message.length === 0) {
                console.error('Cannot send empty application notification');
            }

            var notification = {
                type: 'ERROR',
                message: message,
                url: url,
                durationInMs: durationInMs
            };
            $rootScope.$broadcast(NOTIFICATION_EVENT, notification);
        }

        function clear() {
            $rootScope.$broadcast(CLEAR_NOTIFICATION_EVENT);
        }

        return {
            sendMessage: sendMessage,
            sendWarning: sendWarning,
            sendError: sendError,
            clear: clear
        };
    }]);