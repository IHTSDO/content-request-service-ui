'use strict';
angular.module('conceptRequestServiceApp.userPreferences', [])
    .controller('UserPreferencesCtrl', [
        '$rootScope',
        '$scope',
        '$uibModalInstance',
        'requestService',
        'notificationService',
        function ($rootScope, $scope, $uibModalInstance, requestService, notificationService) {
            var vm = this;

            var loadUserPreferences = function () {
                requestService.getUserPreferences().then(function (response) {
                    vm.userPreferences = response;
                });
            };

            var revertChange = function () {
                // just reload user preferences
                loadUserPreferences();
            };

            var saveUserPreferences = function () {
                requestService.saveUserPreferences(vm.userPreferences).then(function (response) {
                    if (!response) {
                        notificationService.sendError('Unexpected error saving settings. Your changes may not persist across sessions', 0);
                    } else {
                        notificationService.sendMessage('Settings updated', 5000);
                        $uibModalInstance.close(response);
                    }
                });
            };

            var closeModal = function () {
                //$rootScope.layout = $scope.layoutOriginal;
                $uibModalInstance.close();
            };


            // retrieve the user preferences on loading
            loadUserPreferences();

            vm.revertChange = revertChange;
            vm.saveUserPreferences = saveUserPreferences;
            vm.closeModal = closeModal;
        }]);
