'use strict';
angular.module('conceptRequestServiceApp.request')
    .controller('ModalAssignRequestCtrl', [
        '$rootScope',
        '$scope',
        '$uibModalInstance',
        'REQUEST_INPUT_MODE',
        'REQUEST_TYPE',
        function ($rootScope, $scope, $uibModalInstance, REQUEST_INPUT_MODE, REQUEST_TYPE) {
            var vm = this;

            var initView = function () {
                vm.requestType = null;
                vm.msgSuccess = null;
                vm.msgError = null;

                vm.inputMode = REQUEST_INPUT_MODE.SIMPLE.value;
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
                    $uibModalInstance.close({requestType: vm.requestType, inputMode: vm.inputMode});
                } else {
                    showErrorMessage('crs.request.message.error.requestTypeRequired');
                }
            };

            var identifyInputMode = function (im) {
                if (im !== undefined && im !== null) {
                    for (var inputModeKey in REQUEST_INPUT_MODE) {
                        if (REQUEST_INPUT_MODE.hasOwnProperty(inputModeKey) &&
                            REQUEST_INPUT_MODE[inputModeKey].value === im) {
                            return REQUEST_INPUT_MODE[inputModeKey];
                        }
                    }
                }

                return null;
            };

            $scope.$watch(function () {
                return vm.inputMode;
            }, function (newVal) {
                var inputMode = identifyInputMode(newVal),
                    foundSelected = false;
                if (inputMode) {
                    vm.requestTypes = {};

                    for (var i = 0; i < inputMode.requestTypes.length; i++) {
                        vm.requestTypes[inputMode.requestTypes[i]] = REQUEST_TYPE[inputMode.requestTypes[i]];
                        if (vm.requestType &&
                            REQUEST_TYPE[inputMode.requestTypes[i]].value === vm.requestType) {
                            foundSelected = true;
                        }
                    }

                    if (vm.requestType && !foundSelected) {
                        vm.requestType = REQUEST_TYPE.CHANGE_RETIRE_CONCEPT.value;
                    }
                } else {
                    vm.requestTypes = null;
                    vm.requestType = null;
                }
            });

            vm.createNewRequest = createNewRequest;
            vm.closeModal = closeModal;
            vm.inputModes = REQUEST_INPUT_MODE;
            vm.requestTypes = null;

            initView();
        }]
    );
