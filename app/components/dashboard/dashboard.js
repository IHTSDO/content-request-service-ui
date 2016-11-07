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
            .when('/my-assigned-requests', {
                redirectTo: '/dashboard/my-assigned-requests'
            })
            .when('/batches', {
                redirectTo: '/dashboard/batches'
            })
            .when('/accepted-requests', {
                redirectTo: '/dashboard/accepted-requests'
            })
            .when('/submitted-requests',{
                redirectTo: '/dashboard/submitted-requests'
            })
            .when('/filter-requests',{
                redirectTo: '/dashboard/filter-requests'
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
        'requestService',
        function ($rootScope, $uibModal, $routeParams, $location, $route, accountService, notificationService, requestService) {
            var vm = this;
            vm.activeList = $route.current.params.list;

            var initView = function () {
                var list = $routeParams.list;
                // check admin role
                accountService.checkUserPermission().then(function (rs) {
                    vm.permissionChecked = true;
                    vm.isAdmin = (rs.isAdmin === true);
                    vm.isViewer = (rs.isViewer === true);
                    vm.isStaff = (rs.isStaff === true);
                    vm.isRequester = (rs.isRequester === true);
                    // if(vm.isViewer){
                    //     $rootScope.pageTitles = [
                    //         {url: '#/submitted-requests', label: 'crs.request.list.title.submittedRequests'}
                    //     ];
                    //     vm.listView = 'components/request/submitted-request-list.html';
                    // }
                    getStatisticsRequests();
                
                    switch (list) {
                        case 'batches':
                            $rootScope.pageTitles = [
                                {url: '#/batches', label: 'crs.batch.list.title'}
                            ];
                            vm.listView = 'components/batch/batch-list.html';
                            break;
                        case 'my-assigned-requests':
                            $rootScope.pageTitles = [
                                {url: '#/my-assigned-requests', label: 'crs.request.list.title.myAssignedRequests'}
                            ];
                            vm.listView = 'components/request/my-assigned-requests.html';
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
                        case 'filter-requests':
                            $rootScope.pageTitles = [
                                {url: '#/submitted-requests', label: 'crs.request.list.title.submittedRequests'}
                            ];
                            vm.listView = 'components/request/filter-requests.html';
                            break;
                        case 'requests':
                            $rootScope.pageTitles = [
                                {url: '#/requests', label: 'crs.request.list.title.requests'}
                            ];
                            vm.listView = 'components/request/request-list.html';
                            break;
                        /* falls through */
                        default:
                            if(vm.isViewer){
                                $rootScope.pageTitles = [
                                    {url: '#/submitted-requests', label: 'crs.request.list.title.submittedRequests'}
                                ];
                                vm.listView = 'components/request/submitted-request-list.html';
                                break;
                            }else if(vm.isAdmin || vm.isStaff){
                                $rootScope.pageTitles = [
                                    {url: '#/my-assigned-requests', label: 'crs.request.list.title.myAssignedRequests'}
                                ];
                                vm.listView = 'components/request/my-assigned-requests.html';
                                break;
                            }else{
                                $rootScope.pageTitles = [
                                    {url: '#/requests', label: 'crs.request.list.title.requests'}
                                ];
                                vm.listView = 'components/request/request-list.html';
                                break;
                            }
                    }
                });
            };

            var createRequest = function (rs) {
                //$location.url('requests/new/' + rs.requestType + ((rs.inputMode)?'?inputMode=' + rs.inputMode : ''));
                $location.path('requests/new/' + rs.requestType).search({inputMode: rs.inputMode});
            };

            var editRequest = function (requestId) {
                  $location.path('requests/edit/' + requestId).search();
            };

            var previewRequest = function (requestId) {
                  $location.path('requests/preview/' + requestId).search();
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

            var getStatisticsRequests = function(){
                return requestService.getStatisticsRequests().then(function(data){
                    vm.statisticsRequests = data;
                    if(vm.isRequester){
                        for(var i in data){
                            if(data[i].status === 'Assigned'){
                                vm.statisticsRequests.splice(i, 1);
                            }
                            if(data[i].status === 'Unassigned'){
                                vm.statisticsRequests.splice(i, 1);
                            }
                        }
                    }
                    
                });
            };

            var filterStatus = function(status){
                if(status === 'ALL'){
                    return;
                }
				var manager = null;
				switch(status) {
					case 'ALL_REQUEST':
						status = null;
						break;
					case 'Assigned':
						status = null;
						manager = "{assigned}";
						break;
					// case 'My_Assigned':
					// 	status = null;
					// 	manager = currentUser;
					// 	break;
					case 'Unassigned':
						status = null;
						manager = "{unassigned}";
						break;
					
					default:
						break;
				}
				if(status !== 'My_Assigned'){
                    $location.path('dashboard/submitted-requests').search({status:status, manager:manager, showClosedRequest:true, cache:false});
                }else{
                    $location.path('dashboard/my-assigned-requests').search({showClosedRequest:true, cache: false});
                }
            };
            var filterAssignedRequests = function(status){
                if(status === 'ALL_REQUEST' || status === 'Assigned' || status === 'ALL' || status === 'Unassigned'){
                    return;
                }
                accountService.getAccountInfo().then(function (accountDetails) {
                    $location.path('dashboard/submitted-requests').search({status:status, manager: accountDetails.login, showClosedRequest:true, cache: false});                   
                });
            };
			

            var filterMyRequest = function(status){
				if(status === 'Assigned' || status === 'Unassigned'){
					var manager = "{assigned}";
					if(status === 'Unassigned'){
						manager = "{unassigned}";
					}
					accountService.getAccountInfo().then(function (accountDetails) {
						$location.path('dashboard/requests').search({manager:manager, ogirinatorId: accountDetails.login, showClosedRequest:true, cache: false});                   
					});
                    return;
                }
                $location.path('dashboard/requests').search({status:status, showClosedRequest:true, cache: false});
            };

            vm.openCreateRequestModal = openCreateRequestModal;
            vm.openBatchImportModal = openBatchImportModal;
            vm.editRequest = editRequest;
            vm.previewRequest = previewRequest;
            vm.showBatchDetails = showBatchDetails;
            vm.filterStatus = filterStatus;
            vm.filterMyRequest = filterMyRequest;
            vm.filterAssignedRequests = filterAssignedRequests;
            vm.permissionChecked = false;
            vm.isAdmin = false;
            vm.isViewer = false;
            vm.isStaff = false;
            vm.isRequester = false;

            vm.testIMS = function () {
                accountService.getTestUsers();
            };

            initView();
        }
    ]);