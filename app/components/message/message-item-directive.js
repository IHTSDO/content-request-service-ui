'use strict';

angular.module('conceptRequestServiceApp.message')
    .directive('messageItem', [
        '$filter',
        '$location',
        'messageService',
        'MESSAGE_TYPE',
        'BULK_ACTION',
        '$uibModal',
        function ($filter, $location, messageService, MESSAGE_TYPE, BULK_ACTION, $uibModal) {
            var dateFilter = $filter('date');
            var requestStatusFilter = $filter('requestStatus');
            var batchImportStatusFilter = $filter('batchImportStatus');
            var translateFilter = $filter('translate');
            var buildMessageItem = function (messageType, message) {
                var targetUrl;
                var bulkActionLangKey;
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
                    case MESSAGE_TYPE.BULK_ACTION_COMPLETED:
                        bulkActionLangKey = 'crs\.notification\.bulkAction\.modalTitle\.' + message.details.actionType;
                        msgItemHtml.push('<div class="message-detail-content">');
                        msgItemHtml.push(translateFilter('crs.notification.bulkAction.' + message.details.actionType));
                        msgItemHtml.push(': ');
                        msgItemHtml.push(message.details.processedItemsCount);
                        msgItemHtml.push(', ');
                        msgItemHtml.push(translateFilter('crs.notification.bulkAction.failedRequests'));
                        msgItemHtml.push(': ');
                        msgItemHtml.push(message.details.ignoredItemsCount);
                        msgItemHtml.push('</div>');
                        msgItemHtml.push('<a class="message-detail-content" ng-click="openBulkActionDetailDirective()">Click to view details</a>');
                        break;
                    case MESSAGE_TYPE.MANAGER_CHANGED: 
                        msgItemHtml.push('<div class="message-detail-content">');
                        msgItemHtml.push('Request ');
                        msgItemHtml.push(message.details.id);
                        msgItemHtml.push(' has been assigned to you');
                        msgItemHtml.push(message.details.topic);
                        msgItemHtml.push('</div>');

                        msgItemHtml.push('<div><span class="badge requestStatus ' + message.details.status + '">');
                        msgItemHtml.push(translateFilter(requestStatusFilter(message.details.status)));
                        msgItemHtml.push('</span></div>');

                        targetUrl = '#/requests/view/' + message.details.id;
                        break;
                    default:
                        break;
                }

                if(bulkActionLangKey){
                    msgItemHtml.splice(0, 0, '<a style="color:inherit" ng-click="openBulkActionDetailDirective()">');
                    msgItemHtml.push('</a>');
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
                controller: function($scope, $compile){
                    $scope.createHTML = function(){
                        if ($scope.message) {
                            var messageType = messageService.identifyMessageType($scope.message);
                            var appendHtml = $compile(buildMessageItem(messageType, $scope.message))($scope);
                            return appendHtml;
                        }
                        return '';
                    };
                    $scope.openBulkActionDetailDirective = function(){
                        var bulkActionTitleLangKey = 'crs\.notification\.bulkAction\.modalTitle\.' + $scope.message.details.actionType;
                        var modalInstance = $uibModal.open({
                            templateUrl: 'components/request/bulk-action-responding-modal.html',
                            controller: 'BulkActionRespondingModalCtrl as modal',
                            resolve: {
                                bulkActionId: function() {
                                    return $scope.message.details.id;
                                },
                                actionLangKey: function(){
                                    return bulkActionTitleLangKey;
                                }
                            }
                        });

                        modalInstance.result.then(function() {
                        });
                    };
                },
                link: function (scope, $element) {
                    if (scope.message) {
                        $element.html(scope.createHTML());
                    }
                }
            };
        }
    ]);
