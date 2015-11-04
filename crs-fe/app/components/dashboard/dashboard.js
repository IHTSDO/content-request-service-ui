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
        function ($rootScope, $uibModal, $routeParams) {
            var vm = this;

            var initView = function () {
                var list = $routeParams.list;
                switch (list) {
                    case 'batches':
                        $rootScope.pageTitles = ['My Batches'];
                        vm.listView = 'components/batch/batch-list.html';
                        break;
                    case 'requests':
                    default:
                        $rootScope.pageTitles = ['My Requests'];
                        vm.listView = 'components/request/request-list.html';
                        break;
                }

            };

            var openCreateRequestModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'components/request/modal-create-request.html',
                    controller: 'ModalCreateRequestCtrl as modal'
                });

                modalInstance.result.then(function (response) {
                    if (response) {
                    }
                }, function () {

                });
            };

            vm.openCreateRequestModal = openCreateRequestModal;
            initView();
        }
    ]);