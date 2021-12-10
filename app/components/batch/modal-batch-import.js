'use strict';
angular.module('conceptRequestServiceApp.batch')
    .controller('ModalBatchImportConfirmCtrl', [
        '$rootScope',
        '$scope',
        '$uibModalInstance',
        'batchService',
        function ($rootScope, $scope, $uibModalInstance, batchService) {
            var vm = this;

            var initView = function () {
                vm.uploading = false;
                vm.progress = 0;
                vm.selectedFile = null;
                vm.msgSuccess = null;
                vm.msgError = null;
            };

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

            var importFile = function () {
                if (vm.selectedFile !== undefined && vm.selectedFile !== null) {
                    //$uibModalInstance.close(vm.selectedFile);
                    batchService.uploadBatchFile(vm.selectedFile).then(function (response) { // success
                        $uibModalInstance.close(response.data);
                    }, function (error) { // error
                        console.log(error);
                        showErrorMessage(error.msg);
                    }, function (evt) { // progress
                        vm.uploading = true;
                        vm.progress = parseInt(100.0 * evt.loaded / evt.total);
                    });

                } else {
                    showErrorMessage('crs.batch.message.error.fileRequired');
                    vm.uploading = false;
                    vm.progress = 0;
                }
            };

            vm.importFile = importFile;
            vm.closeModal = closeModal;

            initView();
        }]
    );
