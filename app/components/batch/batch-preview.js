'use strict';

angular
    .module('conceptRequestServiceApp.batch')
    .controller('BatchPreviewCtrl', [
        '$rootScope',
        '$scope',
        '$filter',
        '$routeParams',
        '$interval',
        '$uibModal',
        'ngTableParams',
        'batchService',
        'configService',
        'notificationService',
        'BATCH_IMPORT_STATUS',
        'BATCH_PREVIEW_TAB',
        function ($rootScope, $scope, $filter, $routeParams, $interval, $uibModal, ngTableParams, batchService, configService, notificationService, BATCH_IMPORT_STATUS, BATCH_PREVIEW_TAB) {
            var fileStatusPoller;
            var vm = this;
            var fileStatusPollingInterval = configService.getFileStatusPollingInterval();

            var initView = function () {
                $rootScope.pageTitles = ['crs.batch.preview.title.pageTitle'];

                vm.uploading = false;
                vm.uploadingProgress = 0;
                vm.uploadingFile = null;
                vm.selectedFile = null;

                loadUploadedFiles();
            };

            var loadUploadedFiles = function () {
                //vm.uploadedFiles = null;

                batchService.getUploadedFiles().then(function (files) {
                    var tmpSelectedFile;
                    vm.uploadedFiles = files;

                    if (vm.filesTableParams) {
                        vm.filesTableParams.reload();
                    }

                    if (!fileStatusPoller) {
                        fileStatusPoller = $interval(loadUploadedFiles, fileStatusPollingInterval);
                    }

                    if (vm.selectedFile) {
                        for (var i = 0; i < vm.uploadedFiles.length; i++) {
                            if (vm.uploadedFiles[i].id === vm.selectedFile.id) {
                                tmpSelectedFile = vm.uploadedFiles[i];
                                break;
                            }
                        }

                        if (vm.selectedFile.status === BATCH_IMPORT_STATUS.PROCESSING_UPLOAD.value &&
                            tmpSelectedFile.status === BATCH_IMPORT_STATUS.COMPLETED_UPLOAD.value) {
                            loadPreviewData(BATCH_PREVIEW_TAB.NEW_CONCEPT.value, false);
                        }
                        vm.selectedFile = tmpSelectedFile;
                    }
                });
            };

            var loadPreviewData = function (requestType, clearOnReloading) {
                vm.previewTab = BATCH_PREVIEW_TAB[requestType];

                if (clearOnReloading) {
                    vm.importingRequests = null;
                    if (vm.previewTableParams) {
                        vm.previewTableParams.reload();
                    }
                }

                batchService.getImportingRequests(vm.selectedFile.id, requestType).then(function (requests) {
                    vm.importingRequests = requests;

                    if (vm.previewTableParams) {
                        vm.previewTableParams.reload();
                    }
                });
            };

            var uploadFile = function (file) {
                if (!file) {
                    return;
                }

                vm.uploadingFile = file;
                if (vm.uploadingFile !== undefined && vm.uploadingFile !== null) {

                    batchService.uploadBatchFile(vm.uploadingFile).then(function (response) { // success
                        vm.uploading = false;
                        vm.uploadingProgress = 0;

                        // reload file list
                        loadUploadedFiles();
                    }, function (error) { // error
                        console.log(error);
                        vm.uploading = false;
                        vm.uploadingProgress = 0;
                    }, function (evt) { // uploadingProgress
                        vm.uploading = true;
                        vm.uploadingProgress = parseInt(100.0 * evt.loaded / evt.total);
                    })

                } else {
                    vm.uploading = false;
                    vm.uploadingProgress = 0;
                }
            };

            var selectFile = function (file, forceReload) {
                if (!forceReload &&
                    vm.selectedFile &&
                    vm.selectedFile.id === file.id) {
                    return;
                }

                vm.selectedFile = file;
                vm.importingRequests = null;
                loadPreviewData(BATCH_PREVIEW_TAB.NEW_CONCEPT.value, true);
            };

            var filesTableParams = new ngTableParams({
                    page: 1,
                    count: 5,
                    sorting: {'uploaded': 'desc', name: 'asc'}
                },
                {
                    filterDelay: 50,
                    total: vm.uploadedFiles ? vm.uploadedFiles.length : 0, // length of data
                    getData: function (params) {
                        if (!vm.uploadedFiles || vm.uploadedFiles.length == 0) {
                            return [];
                        } else {

                            var searchStr = params.filter().search;
                            var mydata = vm.uploadedFiles;

                            params.total(mydata.length);
                            mydata = params.sorting() ? $filter('orderBy')(mydata, params.orderBy()) : mydata;

                            return mydata.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        }

                    }
                }
            );

            var previewTableParams = new ngTableParams({
                    page: 1,
                    count: 10
                },
                {
                    filterDelay: 50,
                    total: vm.importingRequests ? vm.importingRequests.length : 0, // length of data
                    getData: function (params) {
                        if (!vm.importingRequests || vm.importingRequests.length == 0) {
                            return [];
                        } else {

                            var searchStr = params.filter().search;
                            var mydata = vm.importingRequests;

                            params.total(mydata.length);
                            mydata = params.sorting() ? $filter('orderBy')(mydata, params.orderBy()) : mydata;

                            return mydata.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        }

                    }
                }
            );

            var openBatchImportModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'components/batch/modal-batch-import-confirm.html',
                    controller: 'ModalBatchImportConfirmCtrl as modal',
                    resolve: {
                        batchFile: vm.selectedFile
                    }
                });

                modalInstance.result.then(function () {
                    importRequests();
                });
            };

            var importRequests = function () {
                if (vm.selectedFile &&
                    vm.selectedFile.status === BATCH_IMPORT_STATUS.COMPLETED_UPLOAD.value) {
                    // get all preview work items
                    // run though to build concepts
                    // submit import with the concepts

                    vm.selectedFile.status = BATCH_IMPORT_STATUS.PROCESSING_IMPORT.value;
                    batchService.importBatch(vm.selectedFile.id).then(function () {
                        loadUploadedFiles();
                    });
                }
            };

            var removeSelectedRequest = function () {
                if (vm.selectedFile &&
                    vm.selectedFile.status === BATCH_IMPORT_STATUS.COMPLETED_UPLOAD.value) {
                    if (window.confirm('Are you sure you want to remove selected file?')) {
                        notificationService.sendMessage('Deleting batch file');
                        batchService.removeBatchPreview(vm.selectedFile.id).then(function () {
                            loadUploadedFiles();
                            vm.selectedFile = null;
                            notificationService.sendMessage('Batch file deleted', 5000);
                        });
                    }
                }
            };

            $scope.$on('$destroy', function () {
                if (fileStatusPoller) {
                    $interval.cancel(fileStatusPoller);
                }
            });

            vm.filesTableParams = filesTableParams;
            vm.previewTableParams = previewTableParams;
            vm.uploadFile = uploadFile;
            vm.selectFile = selectFile;
            vm.loadPreviewData = loadPreviewData;
            vm.importRequests = importRequests;
            vm.removeSelectedRequest = removeSelectedRequest;
            vm.openBatchImportModal = openBatchImportModal;

            initView();
        }
    ]);