'use strict';

angular
    .module('conceptRequestServiceApp.batch', [
    ])
    .value('BATCH_STATUS', {
        NEW: {
            value: 'NEW',
            langKey: 'crs.batch.batchStatus.new'
        },
        IN_PROGRESS: {
            value: 'IN_PROGRESS',
            langKey: 'crs.batch.batchStatus.inProgress'
        },
        COMPLETED: {
            value: 'COMPLETED',
            langKey: 'crs.batch.batchStatus.completed'
        }
    })
    .value('BATCH_IMPORT_STATUS', {
        PROCESSING_UPLOAD: {
            value: 'PROCESSING_UPLOAD',
            langKey: 'crs.batch.batchImportStatus.processingUpload'
        },
        COMPLETED_UPLOAD: {
            value: 'COMPLETED_UPLOAD',
            langKey: 'crs.batch.batchImportStatus.completedUpload'
        },
        PROCESSING_IMPORT: {
            value: 'PROCESSING_IMPORT',
            langKey: 'crs.batch.batchImportStatus.processingImport'
        },
        COMPLETED_IMPORT: {
            value: 'COMPLETED_IMPORT',
            langKey: 'crs.batch.batchImportStatus.completedImport'
        },
        ERROR: {
            value: 'ERROR',
            langKey: 'crs.batch.batchImportStatus.error'
        },
        ABORTED: {
            value: 'ABORTED',
            langKey: 'crs.batch.batchImportStatus.aborted'
        }
    })
    .value('BATCH_PREVIEW_TAB', {
        NEW_CONCEPT: {
            value: 'NEW_CONCEPT',
            previewTable: 'components/batch/batch-preview-new-concept-table.html'
        },
        NEW_DESCRIPTION: {
            value: 'NEW_DESCRIPTION',
            previewTable: 'components/batch/batch-preview-new-description-table.html'
        },
        NEW_RELATIONSHIP: {
            value: 'NEW_RELATIONSHIP',
            previewTable: 'components/batch/batch-preview-new-relationship-table.html'
        },
        CHANGE_RETIRE_CONCEPT: {
            value: 'CHANGE_RETIRE_CONCEPT',
            previewTable: 'components/batch/batch-preview-change-retire-concept-table.html'
        },
        CHANGE_DESCRIPTION: {
            value: 'CHANGE_DESCRIPTION',
            previewTable: 'components/batch/batch-preview-change-retire-description-table.html'
        },
        RETIRE_DESCRIPTION: {
            value: 'RETIRE_DESCRIPTION',
            previewTable: 'components/batch/batch-preview-retire-description-table.html'
        },
        RETIRE_RELATIONSHIP: {
            value: 'RETIRE_RELATIONSHIP',
            previewTable: 'components/batch/batch-preview-change-retire-relationship-table.html'
        },
        CHANGE_RELATIONSHIP: {
            value: 'CHANGE_RELATIONSHIP',
            previewTable: 'components/batch/batch-preview-change-relationship-table.html'
        },
        OTHER: {
            value: 'OTHER',
            previewTable: 'components/batch/batch-preview-other-table.html'
        }
    })
    .config(function ($routeProvider) {
        $routeProvider
            .when('/batches/:batchId/:mode', {
                templateUrl: 'components/batch/batch-details.html',
                controller: 'BatchDetailsCtrl',
                controllerAs: 'batchVM'
            })
            .when('/batches/preview', {
                templateUrl: 'components/batch/batch-preview.html',
                controller: 'BatchPreviewCtrl',
                controllerAs: 'batchPreviewVM'
            });
    }).controller('BatchCtrl', [
        '$rootScope',
        '$routeParams',
        'batchService',
        'notificationService',
        function ($rootScope, $routeParams, batchService, notificationService) {
            var vm = this;
            var batchId =  $routeParams.batchId;

            var initView = function () {
                $rootScope.pageTitles = ['View Batch', batchId];
                loadBatch();
            };

            var loadBatch = function () {
                notificationService.sendMessage('Loading batch ' + batchId + '...', 0);

                vm.batch = null;
                batchService.getBatch(batchId).then(function (batch) {
                    vm.batch = batch;

                    notificationService.sendMessage('Batch loaded', 5000);
                });
            };

            initView();
        }
    ]);