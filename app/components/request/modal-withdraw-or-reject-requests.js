'use strict';
angular.module('conceptRequestServiceApp.request')
    .controller('ModalWithdrawOrRejectRequestsCtrl', [
        '$rootScope',
        '$scope',
        '$uibModalInstance',
        'langKey',
        function ($rootScope, $scope, $uibModalInstance, langKey) {
            var vm = this;
            vm.isInternal = false;

            var initView = function () {
                vm.msgSuccess = null;
                vm.msgError = null;
            };

            var closeModal = function () {
                $uibModalInstance.dismiss('cancel');
            };

            var changeRequestStatus = function () {
                $uibModalInstance.close({
                    reason: vm.reason
                });
            };

            vm.changeRequestStatus = changeRequestStatus;
            vm.closeModal = closeModal;
            vm.selectedProject = null;
            vm.assignee = null;
            vm.loadingProjectMsg = null;
            vm.langKey = langKey;

            initView();
        }]
    );
