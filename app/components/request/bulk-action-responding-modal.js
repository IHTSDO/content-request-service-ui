'use strict';
angular.module('conceptRequestServiceApp.request')
    .controller('BulkActionRespondingModalCtrl', [
        '$rootScope',
        '$scope',
        '$uibModalInstance',
        'bulkActionId',
        'requestService',
        'BULK_ACTION_STATUS',
        '$interval',
        'actionLangKey',
        'notificationService',
        '$timeout',
        function ($rootScope, $scope, $uibModalInstance, bulkActionId, requestService, BULK_ACTION_STATUS, $interval, actionLangKey, notificationService, $timeout) {
            var vm = this;
            var intervalGetBulkAction;

            var closeModal = function () {
                $uibModalInstance.close();
                $scope.$on('$destroy', function(){
                  $timeout.cancel(intervalGetBulkAction);
                });
            };

            var getBulkActionStatus = function(){
                requestService.getBulkActionStatus(bulkActionId).then(function(data){
                    if(data.status === BULK_ACTION_STATUS.STATUS_COMPLETED.value || data.status === BULK_ACTION_STATUS.STATUS_ERROR.value){
                        vm.bulkActionLoading = !vm.bulkActionLoading;
                        vm.bulkActionRespondingData = data;
                        extractError(data.errorMessages);
                        // $interval.cancel(bulkActionCurrentStatus);
                    }else{
                        intervalGetBulkAction = $timeout(function () {
                            getBulkActionStatus(bulkActionId);
                        }, 5000);
                    }
                }, function(error){
                    notificationService.sendMessage(error.message, 5000);
                });
            };

            var extractError = function(error){
                vm.splitErrorMessage = error.split(";");
                if(vm.actionLangKey === "crs.request.bulkAction.action.submit"){
                    vm.listMsgHtml = [];
                    for(var i in vm.splitErrorMessage){
                        var splitMsg = vm.splitErrorMessage[i].split(": ");
                        if(splitMsg[2]){
                            var substringMsg = splitMsg[2].substring(1, splitMsg[2].indexOf("]"));
                            if(substringMsg){
                                var listId = substringMsg.split(", ");
                                if(listId){
                                    for(var j in listId){
                                        var htmlTemplate;
                                        if(splitMsg[1].indexOf("request") !== -1){
                                            htmlTemplate = '<span style="display: table; margin-left: 30px; margin-top: -28px; margin-bottom: 28px">' + splitMsg[0] + ': ' + splitMsg[1] + '&nbsp; <a class="alert-primary" href="/#/requests/preview/' + listId[j] + '" target="_blank">' + listId[j] + '</a>]</span>';
                                        }else{
                                            htmlTemplate = '<span style="display: table; margin-left: 30px; margin-top: -28px; margin-bottom: 28px">' + splitMsg[0] + ': ' + splitMsg[1] + '&nbsp; <a class="alert-primary" href="' + ($rootScope.link.snomedInfo? $rootScope.link.snomedInfo:"http://snomed.info/id/") + listId[j] + '" target="_blank">' + listId[j] + '</a>]</span>';
                                        }
                                        vm.listMsgHtml.push(htmlTemplate);
                                    }  
                                }
                            }
                        }else if(splitMsg[1]){
                            var htmlTemplate1 = '<span style="display: table; margin-left: 30px; margin-top: -28px; margin-bottom: 28px">' + splitMsg[0] + ': ' + splitMsg[1] +'</span>';
                            vm.listMsgHtml.push(htmlTemplate1);
                        }
                    }
                }
            };
            getBulkActionStatus();

            vm.actionLangKey = actionLangKey;
            vm.closeModal = closeModal;
        }]
    );