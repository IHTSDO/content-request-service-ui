'use strict';
angular.module('conceptRequestServiceApp.batch')
    .controller('ModalBatchImportConfirmCtrl', [
        '$rootScope',
        '$scope',
        '$uibModalInstance',
        'batchService',
        'batchFile',
        function ($rootScope, $scope, $uibModalInstance, batchService, batchFile) {
            var vm = this;

            var initView = function () {
                vm.batchFile = batchFile;
            };

            var closeModal = function () {
                $uibModalInstance.dismiss('cancel');
            };

            var importFile = function () {
                $uibModalInstance.close();
            };

            vm.importFile = importFile;
            vm.closeModal = closeModal;

            initView();
        }]
    );

