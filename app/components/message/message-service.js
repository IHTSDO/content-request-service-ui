'use strict';

angular.module('conceptRequestServiceApp.message')
    .service('messageService', [
        'crsService',
        'CRS_API_ENDPOINT',
        'MESSAGE_TYPE',
        function (crsService, CRS_API_ENDPOINT, MESSAGE_TYPE) {

            var checkNewMessages = function () {
                var messageEndpoint = CRS_API_ENDPOINT.MESSAGE;

                return crsService.sendGet(messageEndpoint + '/new/check' , null, true);
            };

            var countNewMessages = function () {
                var messageEndpoint = CRS_API_ENDPOINT.MESSAGE;

                return crsService.sendGet(messageEndpoint + '/new/count' , null, true);
            };

            var getMessages = function (offset, limit) {
                var listEndpoint = CRS_API_ENDPOINT.MESSAGE_LIST;
                var params = {};

                if (offset) {
                    params.offset = offset;
                }

                if (limit) {
                    params.limit = limit;
                }

                return crsService.sendGet(listEndpoint, params, null, true);
            };

            var removeMessages = function (messageList) {
                var messageEndpoint = CRS_API_ENDPOINT.MESSAGE;
                var params;

                if (messageList !== undefined &&
                    messageList !== null) {
                    params = {
                        notificationIds: messageList
                    };
                }

                return crsService.sendDelete(messageEndpoint, params, null);
            };

            var readMessages = function (messageList) {
                var messageEndpoint = CRS_API_ENDPOINT.MESSAGE;
                var params;

                if (messageList !== undefined &&
                    messageList !== null) {
                    params = {
                        notificationIds: messageList
                    };
                }

                return crsService.sendPut(messageEndpoint + '/new/read' , params, null);
            };

            var identifyMessageType = function (message) {
                if (message &&
                    message.notificationType) {
                    return MESSAGE_TYPE[message.notificationType];
                }
            };

            return {
                getMessages: getMessages,
                removeMessages: removeMessages,
                checkNewMessages: checkNewMessages,
                countNewMessages: countNewMessages,
                identifyMessageType: identifyMessageType,
                readMessages: readMessages
            };
        }
    ]);