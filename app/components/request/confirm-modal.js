'use strict';
angular.module('conceptRequestServiceApp.request')
    .controller('ConfirmModalCtrl', [
        '$rootScope',
        '$scope',
        '$uibModalInstance',
        function ($rootScope, $scope, $uibModalInstance) {
            var vm = this;

            var confirm = function () {
                $uibModalInstance.close();
            };

            var closeModal = function () {
                $uibModalInstance.dismiss('cancel');
            };

            vm.confirm = confirm;
            vm.closeModal = closeModal;
        }]
    );