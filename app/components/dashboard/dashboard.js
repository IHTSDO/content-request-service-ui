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
        '$route',
        'notificationService',
        function ($rootScope, $uibModal, $routeParams, $location, $route, notificationService) {
            var vm = this;

            var initView = function () {
                var list = $routeParams.list;
                switch (list) {
                    case 'batches':
                        $rootScope.pageTitles = ['crs.batch.list.title'];
                        vm.listView = 'components/batch/batch-list.html';
                        break;
                    case 'requests':
                    default:
                        $rootScope.pageTitles = ['crs.request.list.title.requests'];
                        vm.listView = 'components/request/request-list.html';
                        break;
                }
            };

            var createRequest = function (rs) {
                //$location.url('requests/new/' + rs.requestType + ((rs.inputMode)?'?inputMode=' + rs.inputMode : ''));
                $location.path('requests/new/' + rs.requestType).search({inputMode: rs.inputMode});
            };

            var editRequest = function (requestId) {
                  $location.path('requests/edit/' + requestId);
            };

            var importBatchFile = function (response) {
                //$route.reload();
                notificationService.sendMessage('Successfully import ' + response.success + ' requests from batch file' , 5000);
                showBatchDetails(response.batchId);
            };

            var showBatchDetails = function (batchId) {
                $location.path('batches/' + batchId + '/view');
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

            var openBatchImportModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'components/batch/modal-batch-import.html',
                    controller: 'ModalBatchImportCtrl as modal'
                });

                modalInstance.result.then(function (selectedFile) {
                    if (selectedFile !== undefined && selectedFile !== null) {
                        importBatchFile(selectedFile);
                    }
                });
            };

            vm.openCreateRequestModal = openCreateRequestModal;
            vm.openBatchImportModal = openBatchImportModal;
            vm.editRequest = editRequest;
            vm.showBatchDetails = showBatchDetails;
            initView();
        }
    ]);