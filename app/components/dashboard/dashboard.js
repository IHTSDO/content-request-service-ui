'use strict';

angular
    .module('conceptRequestServiceApp.dashboard', [
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/dashboard/:list?', {
                templateUrl: 'components/dashboard/dashboard.html',
                controller: 'DashboardCtrl',
                controllerAs: 'dashboard'
            })
            .when('/requests', {
                redirectTo: '/dashboard/requests'
            })
            .when('/batches', {
                redirectTo: '/dashboard/batches'
            });
    })
    .controller('DashboardCtrl', [
        '$rootScope',
        '$uibModal',
        '$routeParams',
        '$location',
        function ($rootScope, $uibModal, $routeParams, $location) {
            var vm = this;

            var initView = function () {
                var list = $routeParams.list;
                switch (list) {
                    case 'batches':
                        $rootScope.pageTitles = ['crs.request.batch.title'];
                        vm.listView = 'components/batch/batch-list.html';
                        break;
                    case 'requests':
                    default:
                        $rootScope.pageTitles = ['crs.request.list.title.requests'];
                        vm.listView = 'components/request/request-list.html';
                        break;
                }
            };

            var createRequest = function (requestType) {
                $location.path('requests/new/' + requestType);
            };

            var openCreateRequestModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'components/request/modal-create-request.html',
                    controller: 'ModalCreateRequestCtrl as modal'
                });

                modalInstance.result.then(function (selectedRequestType) {
                    if (selectedRequestType !== undefined && selectedRequestType !== null) {
                        createRequest(selectedRequestType);
                    }
                });
            };

            vm.openCreateRequestModal = openCreateRequestModal;
            initView();
        }
    ]);