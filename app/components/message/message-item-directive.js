'use strict';

angular.module('conceptRequestServiceApp.message')
    .directive('messageItem', [
        '$filter',
        '$location',
        'messageService',
        'MESSAGE_TYPE',
        function ($filter, $location, messageService, MESSAGE_TYPE) {
            var dateFilter = $filter('date');
            var requestStatusFilter = $filter('requestStatus');
            var batchImportStatusFilter = $filter('batchImportStatus');
            var translateFilter = $filter('translate');
            var buildMessageItem = function (messageType, message) {
                var targetUrl;
                var msgItemHtml = [];
                msgItemHtml.push('<div class="message-detail-date" style="float:right">' + dateFilter(message.createdDate, 'yyyy-MM-dd H:mm:ss') + '</div>');
                msgItemHtml.push('<div class="message-detail-header">' + translateFilter(messageType.titleLangKey) + '</div>');

                switch(messageType) {
                    case MESSAGE_TYPE.BATCH_IMPORT_STATUS_CHANGE:
                        msgItemHtml.push('<div class="message-detail-content">');
                        msgItemHtml.push(message.details.fileName);
                        msgItemHtml.push('</div>');

                        msgItemHtml.push('<div><span class="badge batchImportStatus ' + message.details.status + '">');
                        msgItemHtml.push(translateFilter(batchImportStatusFilter(message.details.status)));
                        msgItemHtml.push('</span></div>');

                        targetUrl = '#/batches/preview';
                        break;
                    case MESSAGE_TYPE.REQUEST_STATUS_CHANGE:
                        msgItemHtml.push('<div class="message-detail-content">');
                        msgItemHtml.push(message.details.issueKey);
                        msgItemHtml.push(' - ');
                        msgItemHtml.push(message.details.topic);
                        msgItemHtml.push('</div>');

                        msgItemHtml.push('<div><span class="badge requestStatus ' + message.details.status + '">');
                        msgItemHtml.push(translateFilter(requestStatusFilter(message.details.status)));
                        msgItemHtml.push('</span></div>');

                        targetUrl = '#/requests/view/' + message.details.id;
                        break;
                    case MESSAGE_TYPE.BATCH_IMPORT_SUCCESS:
                        msgItemHtml.push('<div class="message-detail-content">');
                        msgItemHtml.push(message.details.fileName);
                        msgItemHtml.push('</div>');

                        msgItemHtml.push('<div><span class="badge batchImportStatus ' + message.details.status + '">');
                        msgItemHtml.push(translateFilter(batchImportStatusFilter(message.details.status)));
                        msgItemHtml.push('</span></div>');

                        targetUrl = '#/batches/' + message.details.batchId + '/view';
                        break;
                    case MESSAGE_TYPE.COMMENT_ADDED:
                        msgItemHtml.push('<div class="message-detail-content">');
                        msgItemHtml.push(message.details.ticketId);
                        msgItemHtml.push(' - ');
                        msgItemHtml.push(message.details.topic);
                        msgItemHtml.push('</div>');

                        targetUrl = '#/requests/view/' + message.details.id;
                        break;
                    default:
                        break;
                }

                if (targetUrl) {
                    msgItemHtml.splice(0, 0, '<a style="color:inherit" href="' + targetUrl + '">');
                    msgItemHtml.push('</a>');
                }

                return msgItemHtml.join('');
            };

            return {
                restrict: 'A',
                replace: true,
                scope: {
                    message: '=messageItem'
                },
                link: function ($scope, $element) {
                    if ($scope.message) {
                        var messageType = messageService.identifyMessageType($scope.message);

                        /*if (!$scope.message.read) {
                            $element.toggleClass('unread');
                        }*/

                        $element.html(buildMessageItem(messageType, $scope.message));
                    }
                }
            };
        }
    ]);
