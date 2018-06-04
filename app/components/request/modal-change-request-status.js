'use strict';
angular.module('conceptRequestServiceApp.request')
    .controller('ModalChangeRequestStatusCtrl', [
        '$rootScope',
        '$scope',
        '$uibModalInstance',
        'requestStatus',
        'STATISTICS_STATUS',
        'data',
        function ($rootScope, $scope, $uibModalInstance, requestStatus, STATISTICS_STATUS, data) {
            var vm = this;

            /*var hideErrorMessage = function () {
                vm.msgError = null;
            };*/

            var hideSuccessMessage = function () {
                vm.msgSuccess = null;
            };

            var showErrorMessage = function (msg) {
                hideSuccessMessage();
                vm.msgError = msg;
            };

            /*var showSuccessMessage = function (msg) {
                hideErrorMessage();
                vm.msgSuccess = msg;
            };*/

            var closeModal = function () {
                $uibModalInstance.dismiss('cancel');
            };

            var changeRequestStatus = function () {
                if (vm.requestStatus === STATISTICS_STATUS.ON_HOLD.value || vm.requestStatus === STATISTICS_STATUS.INTERNAL_INPUT_NEEDED.value){
                    $uibModalInstance.close({
                        reason: vm.comment,
                        internal: vm.internal
                    });
                    return;
                }
                if (vm.comment) {
                    $uibModalInstance.close(vm.comment);
                } else if(vm.requestStatus === 'changeSNOMEDCode'){
                    if(window.confirm("Are you sure to change Local SNOMED CT Code to blank value?")){
                        $uibModalInstance.close(vm.comment);
                    }
                }else{
                    showErrorMessage('crs.request.requestStatusModal.message.error.commentRequired');
                }
            };

            vm.msgSuccess = null;
            vm.msgError = null;
            vm.internal = false;
            vm.changeRequestStatus = changeRequestStatus;
            vm.closeModal = closeModal;
            vm.requestStatus = requestStatus;
            vm.data = data;
        }]
    );
