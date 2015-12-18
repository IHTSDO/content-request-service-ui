'use strict';
angular.module('conceptRequestServiceApp.request')
    .controller('ModalAssignRequestCtrl', [
        '$rootScope',
        '$scope',
        '$uibModalInstance',
        'scaService',
        function ($rootScope, $scope, $uibModalInstance, scaService) {
            var vm = this;

            var initView = function () {
                vm.msgSuccess = null;
                vm.msgError = null;

                vm.loadingProjectMsg = 'crs.message.loading';
                scaService.getProjects().then(function (response) {
                    vm.projects = response;
                }).finally(function () {
                    vm.loadingProjectMsg = null;
                });
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

            var assignRequests = function () {
                //console.log(vm.selectedProject);
                if (vm.selectedProject &&
                    vm.assignee) {
                    $uibModalInstance.close({
                        project: vm.selectedProject,
                        assignee: vm.assignee
                    });
                } else {

                }
            };

            vm.assignRequests = assignRequests;
            vm.closeModal = closeModal;
            vm.projects = null;
            vm.selectedProject = null;
            vm.assignee = null;
            vm.loadingProjectMsg = null;

            initView();
        }]
    );
