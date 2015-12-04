'use strict';

angular
    .module('conceptRequestServiceApp.formControl')
    .directive('conceptInput', [
        'snowowlService',
        function (snowowlService) {
            return {
                restrict: 'E',
                require: '^form',
                scope: {
                    concept: '=',
                    onConceptChanged: '&'
                },
                template: [
                    '<div class="no-padding" style="position:relative"',
                    'drag-enter-class="concept-drag-target"',
                    'drag-hover-class="concept-drag-hover"',
                    'drop-channel="conceptPropertiesObj"',
                    'ui-on-drop="dropConcept($data)">',
                    '<input class="form-control" type="text"',
                    'ng-model="concept.fsn"',
                    'uib-typeahead="suggestion as suggestion.concept.fsn for suggestion in getConceptsForValueTypeahead($viewValue)"',
                    'typeahead-loading="showLoading"',
                    'typeahead-focus-first="false"',
                    'typeahead-wait-ms="700"',
                    'typeahead-on-select="selectConcept($item)"',
                    'typeahead-editable="false" typeahead-min-length="3"/>',
                    '<span style="top:0;position: absolute;padding-top:3px;right:10px" ng-show="showLoading">Loading...</span>',
                    '</div>'
                ].join(''),
                link: function ($scope) {
                    var initControl = function () {
                        if ($scope.concept !== undefined &&
                            $scope.concept !== null &&
                            $scope.concept.conceptId !== undefined &&
                            $scope.concept.conceptId !== null) {
                            dropConcept({id:$scope.concept.conceptId});
                        }
                    };

                    var dropConcept = function (conceptData) {
                        // enable loading
                        $scope.showLoading = true;
                        // load concept details
                        snowowlService.getFullConcept(null, null, conceptData.id).then(function (response) {
                            $scope.concept = response;
                            $scope.showLoading = false;
                        });
                    };

                    var getConceptsForValueTypeahead = function (viewValue) {
                        if ($scope.concept) {
                            $scope.concept.conceptId = null;
                        }

                        // search concepts
                        return snowowlService.findConcepts(null, null, viewValue, 0, 20).then(function (response) {

                            // remove duplicates
                            for (var i = 0; i < response.length; i++) {
                                for (var j = response.length - 1; j > i; j--) {
                                    if (response[j].concept.conceptId === response[i].concept.conceptId) {
                                        // console.debug(' duplicate ', j, response[j]);
                                        response.splice(j, 1);
                                        j--;
                                    }
                                }
                            }
                            return response;
                        });
                    };

                    var selectConcept = function (conceptItem) {
                        // enable loading
                        $scope.showLoading = true;
                        // load concept details
                        snowowlService.getFullConcept(null, null, conceptItem.concept.conceptId).then(function (response) {
                            $scope.concept = response;
                            $scope.showLoading = false;
                        });
                    };

                    if (angular.isFunction($scope.onConceptChanged)) {
                        $scope.$watch('concept', function (newConcept, currentConcept) {
                            if (newConcept &&
                                newConcept !== currentConcept) {
                                $scope.onConceptChanged({
                                    concept: newConcept
                                })
                            }
                        });
                    }

                    $scope.dropConcept = dropConcept;
                    $scope.selectConcept = selectConcept;
                    $scope.getConceptsForValueTypeahead = getConceptsForValueTypeahead;

                    initControl();
                }
            }
        }
    ]);