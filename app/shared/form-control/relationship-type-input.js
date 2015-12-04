'use strict';

angular
    .module('conceptRequestServiceApp.formControl')
    .directive('relationshipTypeInput', [
        'snowowlService',
        function (snowowlService) {
            return {
                restrict: 'E',
                require: '^form',
                scope: {
                    typeConcept: '=',
                    parents: '='
                },
                template: [
                    '<div class="no-padding" style="position:relative" >',
                    //'drag-enter-class="concept-drag-target"',
                    //'drag-hover-class="concept-drag-hover"',
                    //'drop-channel="conceptPropertiesObj"',
                    //'ui-on-drop="dropConcept($data)">',
                    '<input class="form-control" type="text"',
                    'ng-model="typeConcept.fsn"',
                    'uib-typeahead="suggestion as suggestion.fsn for suggestion in getTypeConceptsForValueTypeahead($viewValue)"',
                    'typeahead-loading="showLoading"',
                    'typeahead-focus-first="false"',
                    'typeahead-wait-ms="700"',
                    'typeahead-on-select="selectTypeConcept($item)"',
                    'typeahead-editable="false" typeahead-min-length="0"/>',
                    '<span style="top:0;position: absolute;padding-top:3px;right:10px" ng-show="showLoading">Loading...</span>',
                    '</div>'
                ].join(''),
                link: function ($scope) {
                    /*var dropConcept = function (conceptData) {
                        // enable loading
                        $scope.showLoading = true;
                        // load concept details
                        snowowlService.getFullConcept(null, null, conceptData.id).then(function (response) {
                            $scope.concept = response;
                            $scope.showLoading = false;
                        });
                    };*/

                    var getConceptsForValueTypeahead = function (viewValue) {
                        var isARelConcept = {
                            conceptId: '116680003',
                            fsn: 'Is a (attribute)'
                        };
                        var idList = '';

                        angular.forEach($scope.relationships, function (relationship) {
                            // add to id list if: active, Is A relationship, target specified,
                            // and not inferred
                            if (relationship.active === true &&
                                relationship.type.conceptId === isARelConcept.conceptId &&
                                relationship.target.conceptId &&
                                relationship.characteristicType !== 'INFERRED_RELATIONSHIP') {
                                idList += relationship.target.conceptId + ',';
                            }
                        });
                        idList = idList.substring(0, idList.length - 1);

                        return snowowlService.getDomainAttributes(null, null, idList).then(function (response) {
                            var allowedConcepts = [],
                                items = response.items,
                                item;

                            if (items && items.length > 0) {
                                angular.forEach(items, function (item) {
                                    if (item.id === isARelConcept.conceptId) {
                                        allowedConcepts.push(isARelConcept);
                                    } else {
                                        allowedConcepts.push({
                                            conceptId: item.id,
                                            fsn: item.id
                                        });
                                    }
                                });
                            } else {
                                allowedConcepts.push(isARelConcept);
                            }

                            return allowedConcepts;
                        });
                    };

                    var selectTypeConcept = function (conceptItem) {
                        /*// enable loading
                        $scope.showLoading = true;
                        // load concept details
                        snowowlService.getFullConcept(null, null, conceptItem.concept.conceptId).then(function (response) {
                            console.log(response);
                            $scope.typeConcept = response;
                            $scope.showLoading = false;
                        });*/

                        console.log(conceptItem);
                        $scope.typeConcept = conceptItem;
                    };

                    //$scope.dropConcept = dropConcept;
                    $scope.selectTypeConcept = selectTypeConcept;
                    $scope.getTypeConceptsForValueTypeahead = getConceptsForValueTypeahead;
                }
            }
        }
    ]);