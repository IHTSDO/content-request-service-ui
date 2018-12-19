'use strict';

angular
    .module('conceptRequestServiceApp')
    .controller('HeaderCtrl', [
        '$rootScope',
        '$scope',
        '$uibModal',
        '$timeout',
        '$route',
        '$location',
        '$interval',
        'accountService',
        'messageService',
        'configService',
        function ($rootScope, $scope, $uibModal, $timeout, $route, $location, $interval, accountService, messageService, configService) {
            var vm = this;
            var timeout = null;
            var messagePoller;
            var messagePollingInterval = configService.getMessagePollingInterval(),
                appName = configService.getConfig().app.header,
               announcement = configService.getConfig().app.announcement;


           $rootScope.$on('$locationChangeSuccess', function (event) {
               try{
                  if (window.ga) {
                     window.ga('send', 'pageview', $location.path());
                  }
               } catch(err) {
                  console.log("Could not send GA event");
                  console.log(err);
               }
           });


            var initView = function () {
                checkNewMessages();
            };

            var checkNewMessages = function () {
                messageService.checkNewMessages().then(function (response) {

                    if (response.hasNew) {
                        countNewMessages();
                    } else {
                        vm.newMessagesCount = 0;
                    }

                    //start polling messages
                    if (!messagePoller && !$scope.$$destroyed) {
                        messagePoller = $interval(function () {
                            checkNewMessages();
                        }, messagePollingInterval);
                    }
                });
            };

            var countNewMessages = function () {
                messageService.countNewMessages().then(function (response) {
                    if (vm.newMessagesCount !== response.total) {
                        //loadMessages(0);
                        vm.newMessagesCount = response.total;
                    }
                });
            };

            var loadMessages = function (offset) {
                if (!offset) {
                    offset = 0;
                }

                vm.loadingMessages = true;
                if (offset === 0) {
                    if (vm.messages && vm.messages.items) {
                        angular.forEach(vm.messages.items, function (message) {
                            message.read = true;
                        });
                    }
                }

                messageService.getMessages(offset).then(function (response) {
                    var unreadMessageIds = [];

                    if (response.offset === 0) {
                        vm.messages = response;
                    } else if (vm.messages &&
                        vm.messages.offset !== undefined && vm.messages.offset !== null &&
                        response.offset > vm.messages.offset) {
                        response.items = vm.messages.items.concat(response.items);
                        vm.messages = response;
                    }

                    angular.forEach(vm.messages.items, function (message) {
                        if (!message.read) {
                            unreadMessageIds.push(message.id);
                        }
                    });

                    if (unreadMessageIds.length > 0) {
                        messageService.readMessages(unreadMessageIds);
                    }

                }).finally(function () {
                    vm.loadingMessages = false;
                });
            };

            var loadMoreMessages = function () {
                var currentOffset = vm.messages.offset;
                if (!vm.loadingMessages &&
                    (currentOffset + 1) * vm.messages.limit < vm.messages.total) {
                    loadMessages(currentOffset + 1);
                }
            };

            var clearMessages = function () {
                messageService.removeMessages().then(function () {
                    vm.messages = {items: []};
                });
            };

            var toggleMessagesPane = function (event) {
                var parentEl = angular.element(event.currentTarget.parentElement);
                if (!parentEl.hasClass('open')) {
                    loadMessages(0);
                }
            };

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

                if (vm.notification &&
                    vm.notification.keepMessage) {
                    return;
                }

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

            $rootScope.$on('crs:clearNotifications', function () {
                clearNotification();
            });

            $scope.$on('$destroy', function () {
                if (messagePoller) {
                    $interval.cancel(messagePoller);
                }
            });

            vm.openSettingsModal = openSettingsModal;
            vm.toggleMessagesPane = toggleMessagesPane;
            vm.notification = null;
            vm.clearNotification = clearNotification;
            vm.gotoNotificationLink = gotoNotificationLink;
            vm.messages = null;
            vm.newMessagesCount = 0;
            vm.loadingMessages = false;
            vm.loadMoreMessages = loadMoreMessages;
            vm.clearMessages = clearMessages;
            vm.appName = appName;
            vm.announcement = announcement;

            initView();
        }
    ]);