'use strict';
angular.module('conceptRequestServiceApp.request')
    .controller('ModalCreateRequestCtrl', [
        '$rootScope',
        '$scope',
        '$uibModalInstance',
        function ($rootScope, $scope, $uibModalInstance) {
            var vm = this;

            var closeModal = function () {
                $uibModalInstance.close();
            };

            vm.closeModal = closeModal;
        }]);
