'use strict';

angular.module('conceptRequestServiceApp.conceptEdit')
    .controller('definitionOfChangeModalCtrl', [
        '$scope',
        '$uibModalInstance',
        'requestMetadataService',
        'changeType',
        'changeTarget',
        'isStatic',
        'REQUEST_METADATA_KEY',
        function ($scope, $uibModalInstance, requestMetadataService, changeType, changeTarget, isStatic, REQUEST_METADATA_KEY) {
            var vm = this;

            if (changeTarget && changeTarget.definitionOfChanges) {
                $scope.definitionOfChanges = angular.copy(changeTarget.definitionOfChanges);
            } else {
                $scope.definitionOfChanges = {};
            }

            var loadRequestMetadata = function () {
                var requestMetadata = {};

                requestMetadataService.getMetadata([
                    REQUEST_METADATA_KEY.RELATIONSHIP_TYPE,
                    REQUEST_METADATA_KEY.CHARACTERISTIC_TYPE,
                    REQUEST_METADATA_KEY.REFINABILITY,
                    REQUEST_METADATA_KEY.NEW_CONCEPT_STATUS,
                    REQUEST_METADATA_KEY.CASE_SIGNIFICANCE,
                    REQUEST_METADATA_KEY.CONCEPT_HISTORY_ATTRIBUTE,
                    REQUEST_METADATA_KEY.NEW_DESCRIPTION_STATUS,
                    REQUEST_METADATA_KEY.NEW_RELATIONSHIP_STATUS
                ])
                    .then(function (metadata) {
                        requestMetadata.relationshipTypes = metadata[REQUEST_METADATA_KEY.RELATIONSHIP_TYPE];
                        requestMetadata.characteristicTypes = metadata[REQUEST_METADATA_KEY.CHARACTERISTIC_TYPE];
                        requestMetadata.refinabilities = metadata[REQUEST_METADATA_KEY.REFINABILITY];
                        requestMetadata.newConceptStatuses = metadata[REQUEST_METADATA_KEY.NEW_CONCEPT_STATUS];
                        requestMetadata.caseSignificances = metadata[REQUEST_METADATA_KEY.CASE_SIGNIFICANCE];
                        requestMetadata.historyAttributes = metadata[REQUEST_METADATA_KEY.CONCEPT_HISTORY_ATTRIBUTE];
                        requestMetadata.descriptionStatuses = metadata[REQUEST_METADATA_KEY.NEW_DESCRIPTION_STATUS];
                        requestMetadata.relationshipStatuses = metadata[REQUEST_METADATA_KEY.NEW_RELATIONSHIP_STATUS];

                        $scope.requestMetadata = requestMetadata;
                    });
            };

            var selectDefinitionOfChanges = function () {
                console.log($scope.definitionOfChanges);
                $uibModalInstance.close($scope.definitionOfChanges);
            };

            var cancel = function () {
                $uibModalInstance.dismiss();
            };

            $scope.isStatic = isStatic;

            vm.changeType = changeType;
            vm.changeTarget = changeTarget;
            vm.selectDefinitionOfChanges = selectDefinitionOfChanges;
            vm.cancel = cancel;

            loadRequestMetadata();
        }]
);
