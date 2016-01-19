'use strict';

angular
    .module('conceptRequestServiceApp.formControl')
    .directive('attributeValueInput', [
        'snowowlService',
        function (snowowlService) {
            return {
                restrict: 'E',
                require: ['?^formControlReadonly', '^form'],
                scope: {
                    domainAttribute: '=',
                    concept: '=',
                    conceptStatus: '=',
                    onConceptChanged: '&'
                },
                template: [
                    '<div class="no-padding">',
                    '<input ng-if="readonly" readonly="readonly" class="form-control" type="text" ng-model="concept.fsn" />',
                    '<div ng-if="!readonly" class="no-padding" style="position:relative"',
                    'drag-enter-class="concept-drag-target"',
                    'drag-hover-class="concept-drag-hover"',
                    'drop-channel="conceptPropertiesObj"',
                    'ui-on-drop="dropConcept($data)">',
                    '<input class="form-control" type="text" style="padding-right:30px" ',
                    'ng-model="concept.fsn" ',
                    'ng-blur="conceptInputOnBlur($event)" ng-focus="conceptInputOnFocus($event)"',
                    'uib-typeahead="suggestion as suggestion.fsn.term for suggestion in getConceptsForValueTypeahead($viewValue)" ',
                    //'typeahead-loading="showLoading" ',
                    'typeahead-focus-first="false" ',
                    'typeahead-wait-ms="700" ',
                    'typeahead-on-select="selectConcept($item)" ',
                    'typeahead-editable="false" typeahead-min-length="3"/>',
                    '<span style="top:0;position: absolute;padding-top:3px;right:5px;font-size:14px;{{(showError)?\'color:red\':\'\'}}" ' +
                        'ng-show="showLoading || showError" ' +
                        'class="md" ' +
                        'ng-class="{\'md-spin md-autorenew\':showLoading, \'md-error\':showError}"></span>',
                    '</div>',
                    '</div>'
                ].join(''),
                link: function ($scope, $element, $attrs, reqiredControllers) {
                    var formControlReadonlyCtrl = reqiredControllers[0];
                    var isFocused = false;

                    var buildInvalidConcept = function (droppingConceptId, fsn) {
                        return {
                            conceptId: null,
                            droppingConceptId: droppingConceptId,
                            fsn: fsn
                        };
                    };

                    var initControl = function () {
                        $scope.showLoading = false;
                        $scope.showError = false;

                        if (!$scope.conceptStatus) {
                            $scope.conceptStatus = {
                                loading: false,
                                searching: false,
                                valid: false
                            };
                        }

                        if ($scope.concept &&
                            ($scope.concept.conceptId || $scope.concept.fsn)) {
                            dropConcept({id:$scope.concept.conceptId, fsn:$scope.concept.fsn});
                        }

                        if (formControlReadonlyCtrl) {
                            $scope.readonly = formControlReadonlyCtrl.getReadonlyStatus();
                        }
                    };

                    var dropConcept = function (conceptData) {
                        var attributeId = '';

                        // enable loading
                        $scope.showLoading = true;
                        $scope.showError = false;
                        $scope.conceptStatus.loading = true;
                        $scope.conceptStatus.searching = false;

                        if ($scope.domainAttribute && $scope.domainAttribute.conceptId) {
                            attributeId = $scope.domainAttribute.conceptId;
                        }

                        return snowowlService.getDomainAttributeValues(null, null, attributeId, conceptData.name).then(function (response) {

                            // remove duplicates
                            if (response && response.length > 0) {
                                return snowowlService.getFullConcept(null, null, conceptData.id);
                            } else {
                                $scope.showError = true;
                                $scope.concept = buildInvalidConcept(conceptData.id, conceptData.name);
                                $scope.conceptStatus.valid = false;
                                return false;
                            }
                        }, function () {
                            $scope.showError = true;
                            $scope.concept = buildInvalidConcept(conceptData.id, conceptData.name);
                            $scope.conceptStatus.valid = false;
                        }).then(function (response) {
                            if (response) {
                                $scope.concept = response;
                                $scope.showError = false;
                                $scope.conceptStatus.valid = true;
                            }
                        }, function (error) {
                            $scope.errorMsg = error.msg;
                            $scope.showError = true;
                            $scope.concept = buildInvalidConcept(conceptData.id, conceptData.name);
                            $scope.conceptStatus.valid = false;
                        }).finally(function () {
                            $scope.showLoading = false;
                            $scope.conceptStatus.loading = false;
                            $scope.conceptStatus.searching = false;
                        });
                    };

                    var getConceptsForValueTypeahead = function (viewValue) {
                        var attributeId = '';
                        $scope.showError = false;
                        $scope.showLoading = true;
                        $scope.conceptStatus.loading = false;
                        $scope.conceptStatus.searching = true;

                        if ($scope.concept) {
                            $scope.concept.conceptId = null;
                        }

                        if ($scope.domainAttribute && $scope.domainAttribute.conceptId) {
                            attributeId = $scope.domainAttribute.conceptId;
                        }

                        return snowowlService.getDomainAttributeValues(null, null, attributeId, viewValue).then(function (response) {
                            //restore error status
                            if (!isFocused) {
                                validateConceptInput(viewValue);
                            }

                            // remove duplicates
                            if (response && response.length > 0) {
                                for (var i = 0; i < response.length; i++) {
                                    // console.debug('checking for duplicates', i, response[i]);
                                    for (var j = response.length - 1; j > i; j--) {
                                        if (response[j].id === response[i].id) {
                                            response.splice(j, 1);
                                            j--;
                                        }
                                    }
                                }
                            }

                            return response;
                        }).finally(function () {
                            $scope.showLoading = false;
                            $scope.conceptStatus.loading = false;
                            $scope.conceptStatus.searching = false;
                        });
                    };

                    var selectConcept = function (conceptItem) {
                        // enable loading
                        $scope.showLoading = true;
                        $scope.showError = false;
                        $scope.conceptStatus.loading = true;
                        $scope.conceptStatus.searching = false;
                        // load concept details
                        snowowlService.getFullConcept(null, null, conceptItem.fsn.conceptId).then(function (response) {
                            $scope.concept = response;
                            $scope.showError = false;
                            $scope.conceptStatus.valid = true;
                        }, function (error) {
                            $scope.errorMsg = error.msg;
                            $scope.showError = true;
                            $scope.concept = buildInvalidConcept(conceptItem.fsn.conceptId, conceptItem.fsn.term);
                            $scope.conceptStatus.valid = false;
                        }).finally(function () {
                            $scope.showLoading = false;
                            $scope.conceptStatus.loading = false;
                            $scope.conceptStatus.searching = false;
                        });
                    };

                    var validateConceptInput = function (viewValue) {
                        if ((!($scope.concept && $scope.concept.conceptId) && viewValue) ||
                            (($scope.concept && $scope.concept.conceptId) && !viewValue) ||
                            (($scope.concept && $scope.concept.conceptId) && viewValue && $scope.concept.fsn !== viewValue)) {
                            $scope.showError = true;
                            $scope.concept = buildInvalidConcept(null, viewValue);
                            $scope.conceptStatus.valid = false;
                        } else {
                            $scope.conceptStatus.valid = true;
                            $scope.showError = false;
                        }
                    };

                    var conceptInputOnBlur = function (event) {
                        var viewValue = event.target.value;
                        isFocused = false;
                        validateConceptInput(viewValue);
                    };

                    var conceptInputOnFocus = function () {
                        isFocused = true;
                    };

                    if (angular.isFunction($scope.onConceptChanged)) {
                        $scope.$watch('concept', function (newConcept, currentConcept) {
                            if (newConcept &&
                                newConcept !== currentConcept) {
                                $scope.onConceptChanged({
                                    concept: newConcept
                                });
                            }
                        });
                    }

                    $scope.$watch('domainAttribute', function (newVal) {
                        console.log($scope.concept, newVal);
                        if ($scope.concept && ($scope.concept.droppingConceptId || $scope.concept.conceptId)) {
                            dropConcept({id:($scope.concept.droppingConceptId || $scope.concept.conceptId),name:$scope.concept.fsn});
                        }
                    });

                    $scope.readonly = false;
                    $scope.dropConcept = dropConcept;
                    $scope.selectConcept = selectConcept;
                    $scope.getConceptsForValueTypeahead = getConceptsForValueTypeahead;
                    $scope.conceptInputOnBlur = conceptInputOnBlur;
                    $scope.conceptInputOnFocus = conceptInputOnFocus;

                    initControl();
                }
            };
        }
    ]);