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
            var requestMetadata = {};
            
            if (changeTarget && changeTarget.definitionOfChanges) {
                $scope.definitionOfChanges = angular.copy(changeTarget.definitionOfChanges);
            } else {
                $scope.definitionOfChanges = {};
            }

            var loadRequestMetadata = function () {
                requestMetadataService.getMetadata([
                    REQUEST_METADATA_KEY.RELATIONSHIP_TYPE,
                    REQUEST_METADATA_KEY.CHARACTERISTIC_TYPE,
                    REQUEST_METADATA_KEY.REFINABILITY,
                    REQUEST_METADATA_KEY.NEW_CONCEPT_STATUS,
                    REQUEST_METADATA_KEY.CASE_SIGNIFICANCE,
                    REQUEST_METADATA_KEY.CONCEPT_HISTORY_ATTRIBUTE,
                    REQUEST_METADATA_KEY.NEW_DESCRIPTION_STATUS,
                    REQUEST_METADATA_KEY.NEW_RELATIONSHIP_STATUS,
                    REQUEST_METADATA_KEY.CONCEPT_INACTIVATION_REASON,
                    REQUEST_METADATA_KEY.DESCRIPTION_INACTIVATION_REASON,
                    REQUEST_METADATA_KEY.ASSOCIATION_INACTIVATION_REASON

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
                        requestMetadata.conceptInactivationReasons = metadata[REQUEST_METADATA_KEY.CONCEPT_INACTIVATION_REASON];
                        requestMetadata.descriptionInactivationReasons = metadata[REQUEST_METADATA_KEY.DESCRIPTION_INACTIVATION_REASON];
                        requestMetadata.associationInactivationReasons = metadata[REQUEST_METADATA_KEY.ASSOCIATION_INACTIVATION_REASON];

                        $scope.requestMetadata = requestMetadata;

                        if ($scope.definitionOfChanges && isStatic) {
                            if ($scope.definitionOfChanges.proposedStatus) {
                                var conceptInactivationReason = requestMetadata.conceptInactivationReasons.filter(function(item) {
                                    return item.text === $scope.definitionOfChanges.proposedStatus;
                                })[0];

                                if ($scope.definitionOfChanges.historyAttribute) {
                                    var associationInactivationReason = requestMetadata.associationInactivationReasons.filter(function(item) {
                                        return item.text === $scope.definitionOfChanges.historyAttribute;
                                    })[0];
                                    $scope.isLagacyConceptInactivationReason = !conceptInactivationReason || !associationInactivationReason || conceptInactivationReason.display.indexOf(associationInactivationReason.display) === -1;                                
                                } else {
                                    $scope.isLagacyConceptInactivationReason = (typeof conceptInactivationReason === 'undefined');
                                }                       
                                if (!$scope.isLagacyConceptInactivationReason) {
                                    requestMetadata.historyAttributes = requestMetadata.associationInactivationReasons.filter(function(item) {
                                        return conceptInactivationReason.display.indexOf(item.display) !== -1;
                                    });                            
                                }
                            } 
                            else {
                                $scope.isLagacyConceptInactivationReason = true;
                            }

                            if ($scope.definitionOfChanges.descriptionStatus) {
                                $scope.isLagacyDescriptionInactivationReason = requestMetadata.descriptionInactivationReasons.filter(function(item) {
                                    return item.text === $scope.definitionOfChanges.descriptionStatus;
                                }).length === 0;
                            }
                            else {
                                $scope.isLagacyDescriptionInactivationReason = true;
                            }                            
                        }

                        if (!isStatic) {
                            requestMetadata.historyAttributes = [];
                        }
                    });
            };

            //watch proposedStatus to set default History Attribute
            $scope.$watch(function() {
                return $scope.definitionOfChanges.proposedStatus;
            }, function(newVal) {
                if (newVal && !isStatic) {
                    var inactivationReason = requestMetadata.conceptInactivationReasons.filter(function(item) {
                        return item.text === newVal;
                    })[0];
                    if (inactivationReason) {
                        requestMetadata.historyAttributes = requestMetadata.associationInactivationReasons.filter(function(item) {
                            return inactivationReason && inactivationReason.display.indexOf(item.display) !== -1;
                        });
    
                        if (requestMetadata.historyAttributes.length === 1) {
                            $scope.definitionOfChanges.historyAttribute = requestMetadata.historyAttributes[0].text;
                        }
                        else {
                            $scope.definitionOfChanges.historyAttribute = null;
                        }
        
                        if (newVal === 'Non-conformance to editorial policy') {
                            $scope.definitionOfChanges.historyAttribute = null;
                            $scope.definitionOfChanges.historyAttributeValue = null;
                        }
                    }                    
                }               
            });            

            var selectDefinitionOfChanges = function () {
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
