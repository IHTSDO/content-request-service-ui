'use strict';
angular.module('conceptRequestServiceApp.request')
    .controller('ModalAssignRequestToStaffCtrl', [
        '$rootScope',
        '$scope',
        '$uibModalInstance',
        'scaService',
        'staffs',
        function($rootScope, $scope, $uibModalInstance, scaService, staffs) {
            var vm = this;

            var initView = function() {
                vm.msgSuccess = null;
                vm.msgError = null;

                /*vm.loadingProjectMsg = 'crs.message.loading';
                scaService.getProjects().then(function (response) {
                    vm.projects = response;
                }).finally(function () {
                    vm.loadingProjectMsg = null;
                });*/
            };

            /*var hideErrorMessage = function () {
                vm.msgError = null;
            };*/

            var hideSuccessMessage = function() {
                vm.msgSuccess = null;
            };

            var showErrorMessage = function(msg) {
                hideSuccessMessage();
                vm.msgError = msg;
            };

            /*var showSuccessMessage = function (msg) {
                hideErrorMessage();
                vm.msgSuccess = msg;
            };*/

            var closeModal = function() {
                $uibModalInstance.dismiss('cancel');
            };

            var assignRequests = function() {
                //console.log(vm.selectedProject);
                if (vm.assignee) {
                    $uibModalInstance.close({
                        assignee: vm.assignee
                    });
                } else {
                    showErrorMessage('Please enter required fields');
                }
            };

            vm.assignRequests = assignRequests;
            vm.closeModal = closeModal;
            vm.staffs = staffs;
            vm.assignee = null;

            initView();
        }
    ]);
