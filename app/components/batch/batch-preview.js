/*jshint newcap:false*/
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

                //loadUploadedFiles();
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
                        filesTableParams.data.splice(0, 0, response.data);
                        filesTableParams.reload();
                    }, function () { // error
                        vm.uploading = false;
                        vm.uploadingProgress = 0;
                    }, function (evt) { // uploadingProgress
                        vm.uploading = true;
                        vm.uploadingProgress = parseInt(100.0 * evt.loaded / evt.total);
                    });

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
                    sorting: {'uploadedTime': 'desc', fileName: 'asc'}
                },
                {
                    filterDelay: 700,
                    getData: function (params) {
                        var sortingObj = params.sorting();
                        var sortFields = [], sortDirs = [];

                        if (sortingObj) {
                            angular.forEach(sortingObj, function (dir, field) {
                                sortFields.push(field);
                                sortDirs.push(dir);
                            });
                        }

                        return batchService.getUploadedFiles(
                            params.page() - 1,
                            params.count(),
                            params.filter().search,
                            sortFields,
                            sortDirs,
                            (fileStatusPoller !== undefined && fileStatusPoller !== null))
                            .then(function (response) {
                                var tmpSelectedFile,
                                    items = response.items;

                                params.total(response.total);

                                if (!fileStatusPoller && !$scope.$$destroyed) {
                                    fileStatusPoller = $interval(function () {
                                        filesTableParams.reload();
                                    }, fileStatusPollingInterval);
                                }

                                if (items && items.length > 0) {
                                    if (vm.selectedFile) {
                                        if (vm.selectedFile.removed === true) {
                                            vm.selectedFile = null;
                                        } else {
                                            for (var i = 0; i < items.length; i++) {
                                                if (items[i].id === vm.selectedFile.id) {
                                                    tmpSelectedFile = items[i];
                                                    break;
                                                }
                                            }

                                            if (tmpSelectedFile) {
                                                if (vm.selectedFile.status === BATCH_IMPORT_STATUS.PROCESSING_UPLOAD.value &&
                                                    tmpSelectedFile.status === BATCH_IMPORT_STATUS.COMPLETED_UPLOAD.value) {
                                                    loadPreviewData(BATCH_PREVIEW_TAB.NEW_CONCEPT.value, false);
                                                }

                                                vm.selectedFile = tmpSelectedFile;
                                            }
                                        }
                                    }

                                    return items;
                                } else {
                                    return [];
                                }
                            }, function () {
                                vm.selectedFile = null;
                                return [];
                            });
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
                        if (!vm.importingRequests || vm.importingRequests.length === 0) {
                            return [];
                        } else {

                            //var searchStr = params.filter().search;
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
                        //loadUploadedFiles();
                        filesTableParams.reload();
                    });
                }
            };

            var removeSelectedRequest = function () {
                if (vm.selectedFile &&
                    vm.selectedFile.status === BATCH_IMPORT_STATUS.COMPLETED_UPLOAD.value ||
                    vm.selectedFile.status === BATCH_IMPORT_STATUS.ERROR.value) {
                    if (window.confirm('Are you sure you want to remove selected file?')) {
                        notificationService.sendMessage('Deleting batch file');
                        batchService.removeBatchPreview(vm.selectedFile.id).then(function () {
                            //loadUploadedFiles();
                            vm.selectedFile.removed = true;
                            filesTableParams.reload();
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