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
            };

            getBulkActionStatus();

            vm.actionLangKey = actionLangKey;
            vm.closeModal = closeModal;
        }]
    );