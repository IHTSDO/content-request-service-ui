'use strict';
angular.module('conceptRequestServiceApp.request')
    .controller('ModalCreateRequestCtrl', [
        '$rootScope',
        '$scope',
        '$uibModalInstance',
        'REQUEST_TYPE',
        function ($rootScope, $scope, $uibModalInstance, REQUEST_TYPE) {
            var vm = this;

            var initView = function () {
                vm.requestType = null;
                vm.msgSuccess = null;
                vm.msgError = null;
            };

            var hideErrorMessage = function () {
                vm.msgError = null;
            };

            var hideSuccessMessage = function () {
                vm.msgSuccess = null;
            };

            var showErrorMessage = function (msg) {
                hideSuccessMessage();
                vm.msgError = msg;
            };

            var showSuccessMessage = function (msg) {
                hideErrorMessage();
                vm.msgSuccess = msg;
            };

            var closeModal = function () {
                $uibModalInstance.dismiss('cancel');
            };

            var createNewRequest = function () {
                if (vm.requestType !== undefined && vm.requestType !== null) {
                    $uibModalInstance.close(vm.requestType);
                } else {
                    showErrorMessage('crs.request.message.error.requestTypeRequired');
                }
            };


            vm.createNewRequest = createNewRequest;
            vm.closeModal = closeModal;
            vm.requestTypes = REQUEST_TYPE;

            initView();
        }]
    );
