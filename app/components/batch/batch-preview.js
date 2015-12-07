'use strict';

angular
    .module('conceptRequestServiceApp.batch')
    .controller('BatchPreviewCtrl', [
        '$rootScope',
        '$scope',
        '$filter',
        '$routeParams',
        '$interval',
        'ngTableParams',
        'batchService',
        'configService',
        'BATCH_IMPORT_STATUS',
        'BATCH_PREVIEW_TAB',
        function ($rootScope, $scope, $filter, $routeParams, $interval, ngTableParams, batchService, configService, BATCH_IMPORT_STATUS, BATCH_PREVIEW_TAB) {
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
                vm.uploadedFiles = null;
                batchService.getUploadedFiles().then(function (files) {
                    vm.uploadedFiles = files;

                    if (vm.filesTableParams) {
                        vm.filesTableParams.reload();
                    }

                    if (!fileStatusPoller) {
                        fileStatusPoller = $interval(loadUploadedFiles, fileStatusPollingInterval);
                    }
                });
            };

            var loadPreviewData = function (requestType) {
                vm.importingRequests = null;
                vm.previewTab = BATCH_PREVIEW_TAB[requestType];
                batchService.getImportingRequests(vm.selectedFile.id, requestType).then(function (requests) {
                    vm.importingRequests = requests;

                    if (vm.previewTableParams) {
                        vm.previewTableParams.reload();
                    }
                });
            };

            var uploadFile = function (file) {
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

            var selectFile = function (file) {
                vm.selectedFile = file;
                loadPreviewData(BATCH_PREVIEW_TAB.NEW_CONCEPT.value);
            };

            var filesTableParams = new ngTableParams({
                    page: 1,
                    count: 20,
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

            var importRequests = function () {
                if (vm.selectedFile &&
                    vm.selectedFile.status === BATCH_IMPORT_STATUS.COMPLETED_UPLOAD.value) {
                    // get all preview work items
                    // run though to build concepts
                    // submit import with the concepts
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

            initView();
        }
    ]);