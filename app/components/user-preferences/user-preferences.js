'use strict';
angular.module('conceptRequestServiceApp.userPreferences', [])
    .controller('UserPreferencesCtrl', [
        '$rootScope',
        '$scope',
        '$uibModalInstance',
        'accountService',
        function ($rootScope, $scope, $uibModalInstance, accountService) {
            var vm = this;

            var loadUserPreferences = function () {
                accountService.getUserPreferences().then(function (response) {
                    vm.userPreferences = response;
                });
            };

            var revertChange = function () {
                // just reload user preferences
                loadUserPreferences();
            };

            var saveUserPreferences = function () {
                accountService.applyUserPreferences(vm.userPreferences).then(function (userPreferences) {

                    // if layout specified, attach/replace it in user preferences
                    /*if ($rootScope.layout && $rootScope.layout.name) {
                        if (!userPreferences.layout) {
                            userPreferences.layout = {};
                        }
                        userPreferences.layout[$rootScope.layout.name] = $rootScope.layout;
                    }*/

                    accountService.saveUserPreferences(userPreferences).then(function (response) {
                        if (!response) {
                            //notificationService.sendError('Unexpected error saving settings. Your changes may not persist across sessions', 0);
                        } else {
                            //notificationService.sendMessage('Application preferences updated', 5000);
                        }
                    });
                    $uibModalInstance.close(userPreferences);
                }, function () {
                    vm.errorMsg = 'Unexpected error applying settings';
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
