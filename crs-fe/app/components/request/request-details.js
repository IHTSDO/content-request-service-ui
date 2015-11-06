'use strict';

angular
    .module('conceptRequestServiceApp.request')
    .controller('RequestDetailsCtrl', [
        '$rootScope',
        '$routeParams',
        '$location',
        'requestService',
        'notificationService',
        function ($rootScope, $routeParams, $location, requestService, notificationService) {
            var vm = this;
            var REQUEST_MODE = {
                NEW: 'new',
                EDIT: 'edit'
            };
            var mode = $routeParams.mode,
                param = $routeParams.param;

            var requestId,
                requestType;

            var isValidViewParams = function () {
                var isValidMode = false,
                    isValidParam = false;

                // check valid mode
                for (var requestModeKey in REQUEST_MODE) {
                    if (REQUEST_MODE.hasOwnProperty(requestModeKey) &&
                        REQUEST_MODE[requestModeKey] === mode) {
                        isValidMode = true;
                        break;
                    }
                }

                // check valid param
                if (mode = REQUEST_MODE.NEW) {
                    isValidParam = (requestService.identifyRequestType(requestType) !== null);
                } else {
                    isValidParam = (!isNaN(param) && param > 0)
                }

                return isValidMode && isValidParam;
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

            var initView = function () {
                if (!isValidViewParams) {
                    showErrorMessage('crs.request.message.error.invalidPage');
                } else {
                    if (mode === REQUEST_MODE.NEW) {
                        requestId = null;
                        requestType = requestService.identifyRequestType(param);
                        $rootScope.pageTitles = ['crs.request.details.title.new', requestType.langKey];

                        vm.request = {
                            id: requestId,
                            requestType: requestType.value
                        };

                        vm.requestType = requestType;
                    } else if (mode === REQUEST_MODE.EDIT) {
                        requestId = param;
                        $rootScope.pageTitles = ['crs.request.details.title.edit', requestId];

                        $rootScope.showLoading = true;
                        loadRequest().then(function () {
                            $rootScope.showLoading = false;
                            requestType = requestService.identifyRequestType(vm.request.requestType);

                            if (requestType) {
                                vm.requestType = requestType;
                            } else {
                                showErrorMessage('crs.request.details.error.invalidPage');
                            }
                        });
                    }

                    vm.pageMode = mode;
                }
            };

            var loadRequest = function () {
                notificationService.sendMessage('crs.request.message.requestLoading...', 0);

                vm.request = null;

                return requestService.getRequest(requestId).then(function (request) {
                    vm.request = request;
                    notificationService.sendMessage('crs.request.message.requestLoaded', 5000);
                });
            };


            var cancelEditing = function () {
                $location.path('/dashboard');
            };

            vm.cancelEditing = cancelEditing;
            initView();
        }
    ]);