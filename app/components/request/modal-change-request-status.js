'use strict';
angular.module('conceptRequestServiceApp.request')
    .controller('ModalChangeRequestStatusCtrl', [
        '$rootScope',
        '$scope',
        '$uibModalInstance',
        'requestStatus',
        function ($rootScope, $scope, $uibModalInstance, requestStatus) {
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
                if (vm.comment) {
                    $uibModalInstance.close(vm.comment);
                } else {
                    showErrorMessage('crs.request.requestStatusModal.message.error.commentRequired');
                }
            };

            vm.msgSuccess = null;
            vm.msgError = null;
            vm.changeRequestStatus = changeRequestStatus;
            vm.closeModal = closeModal;
            vm.requestStatus = requestStatus;
        }]
    );
