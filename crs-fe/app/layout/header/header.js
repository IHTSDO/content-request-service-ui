'use strict';

angular
    .module('conceptRequestServiceApp')
    .controller('HeaderCtrl', [
        '$rootScope',
        '$uibModal',
        '$timeout',
        '$route',
        '$location',
        'accountService',
        function ($rootScope, $uibModal, $timeout, $route, $location, accountService) {
            var vm = this;
            var timeout = null;

            var openSettingsModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'components/user-preferences/user-preferences.html',
                    controller: 'UserPreferencesCtrl as userPreferences'
                });

                modalInstance.result.then(function (response) {
                    console.debug('user preferences modal closed with response', response);
                    if (response) {
                        // do nothing -- user preferences ctrl should make appropriate
                        // changes on completion
                    }
                }, function () {
                });
            };

            var clearNotification = function () {
                vm.notification = null;
            };

            var gotoNotificationLink = function () {
                if (vm.notification !== undefined && vm.notification !== null) {
                    if (vm.notification.url.indexOf($location.url()) !== -1 || $location.url().indexOf(vm.notification.url) !== -1) {
                        $route.reload();
                    } else {
                        $location.path(vm.notification.url);
                    }
                }
            };

            $rootScope.$on('crs:accountInfoChanged', function () {
                accountService.getAccountInfo().then(function (accountDetails) {
                    vm.accountDetails = accountDetails;
                });

                vm.isUserLoggedIn = accountService.isUserLoggedIn;
            });

            $rootScope.$on('crs:notification', function (event, notification) {

                if (notification) {

                    // cancel any existing timeout
                    if (timeout) {
                        $timeout.cancel(timeout);
                    }

                    // validation checking of notification url
                    if (notification.url) {
                        // strip any leading #
                        if (notification.url.indexOf('#') === 0) {
                            notification.url = notification.url.substring(1);
                        }

                        // ensure path starts with /
                        if (notification.url.indexOf('/') !== 0) {
                            notification.url = '/' + notification.url;
                        }
                    }

                    // set the notification
                    vm.notification = notification;

                    // if a duration supplied, apply it
                    if (notification.durationInMs > 0) {
                        timeout = $timeout(function () {
                            vm.notification = null;
                        }, notification.durationInMs);
                    }
                }
            });

            $rootScope.$on('crs:clearNotifications', function (event, data) {
                clearNotification();
            });

            vm.openSettingsModal = openSettingsModal;
            vm.notification = null;
            vm.clearNotification = clearNotification;
            vm.gotoNotificationLink = gotoNotificationLink;
        }
    ]);