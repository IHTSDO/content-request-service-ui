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
            })
            .when('/accepted-requests', {
                redirectTo: '/dashboard/accepted-requests'
            })
            .when('/submitted-requests',{
                redirectTo: '/dashboard/submitted-requests'
            });
    })
    .controller('DashboardCtrl', [
        '$rootScope',
        '$uibModal',
        '$routeParams',
        '$location',
        '$route',
        'accountService',
        'notificationService',
        function ($rootScope, $uibModal, $routeParams, $location, $route, accountService, notificationService) {
            var vm = this;

            var initView = function () {
                var list = $routeParams.list;
                switch (list) {
                    case 'batches':
                        $rootScope.pageTitles = [
                            {url: '#/batches', label: 'crs.batch.list.title'}
                        ];
                        vm.listView = 'components/batch/batch-list.html';
                        break;
                    case 'accepted-requests':
                        $rootScope.pageTitles = [
                            {url: '#/accepted-requests', label: 'crs.request.list.title.acceptedRequests'}
                        ];
                        vm.listView = 'components/request/accepted-request-list.html';
                        break;
                    case 'submitted-requests':
                        $rootScope.pageTitles = [
                            {url: '#/submitted-requests', label: 'crs.request.list.title.submittedRequests'}
                        ];
                        vm.listView = 'components/request/submitted-request-list.html';
                        break;
                    case 'requests':
                    /* falls through */
                    default:
                        $rootScope.pageTitles = [
                            {url: '#/requests', label: 'crs.request.list.title.requests'}
                        ];
                        vm.listView = 'components/request/request-list.html';
                        break;
                }

                // check admin role
                accountService.checkUserPermission().then(function (rs) {
                    vm.permissionChecked = true;
                    vm.isAdmin = (rs.isAdmin === true);
                    vm.isViewer = (rs.isViewer === true);
                });
            };

            var createRequest = function (rs) {
                //$location.url('requests/new/' + rs.requestType + ((rs.inputMode)?'?inputMode=' + rs.inputMode : ''));
                $location.path('requests/new/' + rs.requestType).search({inputMode: rs.inputMode});
            };

            var editRequest = function (requestId) {
                  $location.path('requests/edit/' + requestId).search({kb:true});
            };

            var previewRequest = function (requestId) {
                  $location.path('requests/preview/' + requestId).search({kb:true});
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
            vm.previewRequest = previewRequest;
            vm.showBatchDetails = showBatchDetails;
            vm.permissionChecked = false;
            vm.isAdmin = false;
            vm.isViewer = false;

            vm.testIMS = function () {
                accountService.getTestUsers();
            };

            initView();
        }
    ]);