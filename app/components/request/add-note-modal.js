'use strict';
angular.module('conceptRequestServiceApp.request')
    .controller('AddNoteModalCtrl', [
        '$rootScope',
        '$scope',
        '$uibModalInstance',
        function ($rootScope, $scope, $uibModalInstance) {
            var vm = this;
            vm.isInternal = false;

            var initView = function () {
                vm.msgSuccess = null;
                vm.msgError = null;
            };

            var hideSuccessMessage = function () {
                vm.msgSuccess = null;
            };

            var showErrorMessage = function (msg) {
                hideSuccessMessage();
                vm.msgError = msg;
            };

            var closeModal = function () {
                $uibModalInstance.dismiss('cancel');
            };

            var addNote = function () {
                if (vm.message) {
                    $uibModalInstance.close({
                        message: vm.message,
                        isInternal: vm.isInternal
                    });
                } else {
                    showErrorMessage('Please enter required fields');
                }
            };

            vm.addNote = addNote;
            vm.closeModal = closeModal;
            vm.selectedProject = null;
            vm.assignee = null;
            vm.loadingProjectMsg = null;

            initView();
        }]
    );
