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
                if (mode === REQUEST_MODE.NEW) {
                    isValidParam = (requestService.identifyRequestType(param) !== null);
                } else {
                    isValidParam = (param !== undefined && param !== null)
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
                var isValid = isValidViewParams();

                if (!isValid) {
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
                        vm.isValidViewParams = isValid;
                    } else if (mode === REQUEST_MODE.EDIT) {
                        requestId = param;
                        $rootScope.pageTitles = ['crs.request.details.title.edit', requestId];

                        $rootScope.showLoading = true;
                        loadRequest().then(function () {
                            $rootScope.showLoading = false;
                            requestType = requestService.identifyRequestType(vm.request.requestType);

                            if (requestType) {
                                vm.requestType = requestType;
                                vm.isValidViewParams = isValid;
                            } else {
                                showErrorMessage('crs.request.message.error.invalidPage');
                            }
                        });
                    }

                    vm.pageMode = mode;
                }
            };

            var loadRequest = function () {
                notificationService.sendMessage('crs.request.message.requestLoading', 0);

                vm.request = null;

                return requestService.getRequest(requestId).then(function (request) {
                    vm.request = request.workItems[0];
                    vm.request.rfcNumber = request.rfcNumber;
                    notificationService.sendMessage('crs.request.message.requestLoaded', 5000);
                });
            };


            var cancelEditing = function () {
                $location.path('/dashboard');
            };

            var saveRequest = function () {
                requestService.saveRequest(vm.request)
                    .then(function (response) {
                        notificationService.sendMessage('crs.request.message.requestSaved', 5000);
                        $location.path('/dashboard');
                    }, function (e) {
                        console.log(e);
                    });
            };

            var submitRequest = function () {
                requestService.submitRequest(vm.request.rfcNumber)
                    .then(function (response) {
                        notificationService.sendMessage('crs.request.message.requestSubmitted', 5000);
                        $location.path('/dashboard');
                    }, function (e) {
                        console.log(e);
                    });
            };

            vm.cancelEditing = cancelEditing;
            vm.saveRequest = saveRequest;
            vm.submitRequest = submitRequest;
            initView();
        }
    ]);