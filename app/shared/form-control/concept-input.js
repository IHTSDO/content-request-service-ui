'use strict';

angular
    .module('conceptRequestServiceApp.formControl')
    .directive('conceptInput', [
        'snowowlService',
        '$routeParams',
        'requestService',
		'utilsService',
        'REQUEST_TYPE',
        function (snowowlService, $routeParams, requestService, utilsService, REQUEST_TYPE) {
            return {
                restrict: 'E',
                require: ['?^formControlReadonly', '^form'],
                scope: {
                    concept: '=',
                    conceptStatus: '=?',
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
                    'uib-typeahead="suggestion as suggestion.concept.fsn for suggestion in getConceptsForValueTypeahead($viewValue)" ',
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
                    var REQUEST_MODE = {
                        NEW: { value: 'new', langKey: 'crs.request.requestMode.newRequest' },
                        EDIT: { value: 'edit', langKey: 'crs.request.requestMode.editRequest' },
                        PREVIEW: { value: 'preview', langKey: 'crs.request.requestMode.previewRequest' },
                        VIEW: { value: 'view', langKey: 'crs.request.requestMode.viewRequest' }
                    };
                    var mode = $routeParams.mode,
                        param = $routeParams.param;
                    var requestId,
                        requestType;
                    var buildInvalidConcept = function (fsn) {
                        return {
                            conceptId: null,
                            fsn: fsn
                        };
                    };
                    requestType = requestService.identifyRequestType(param);
                    var initControl = function () {
                        $scope.showLoading = false;
                        $scope.showError = false;

                        if ($scope.conceptStatus === undefined || !$scope.conceptStatus) {
                            $scope.conceptStatus = {
                                loading: false,
                                searching: false,
                                valid: false
                            };
                        }

                        if ($scope.concept &&
                            ($scope.concept.conceptId || $scope.concept.fsn)) {
                            if($scope.concept.sourceTerminology === 'SNOMEDCT'){
                                dropConcept({id:$scope.concept.conceptId, fsn:$scope.concept.fsn, sourceTerminology: $scope.concept.sourceTerminology});
                            }
                        }

                        if (formControlReadonlyCtrl) {
                            $scope.readonly = formControlReadonlyCtrl.getReadonlyStatus();
                        }
                    };

                    var dropConcept = function (conceptData) {
                        // enable loading
                        $scope.showLoading = true;
                        $scope.showError = false;
                        $scope.conceptStatus.loading = true;
                        $scope.conceptStatus.searching = false;
                        // load concept details
                        snowowlService.getFullConcept(null, null, conceptData.id).then(function (response) {
							response.descriptions.sort(function(a, b) {
								return utilsService.compareStrings(a.term, b.term);
							});
							response.relationships.sort(function(a, b) {
								return utilsService.compareStrings(a.type.fsn + " - " + a.target.fsn, b.type.fsn + " - " + b.target.fsn);
							});
							
                            $scope.concept = response;
                            // if(requestType === REQUEST_TYPE.NEW_CONCEPT){
                                if(!conceptData.sourceTerminology){
                                    $scope.concept.sourceTerminology = 'SNOMEDCT';
                                }else{
                                    $scope.concept.sourceTerminology = conceptData.sourceTerminology;
                                }
                            // }
                            
                            for(var name in $scope.concept.relationships){
                                $scope.concept.relationships[name].viewName = $scope.concept.relationships[name].type.fsn + " " + $scope.concept.relationships[name].target.fsn;
                            }
                            $scope.showError = false;
                            $scope.conceptStatus.valid = true;
                        }, function (error) {
                            $scope.errorMsg = error.msg;
                            $scope.showError = true;
                            $scope.concept = buildInvalidConcept(conceptData.fsn);
                            $scope.conceptStatus.valid = false;
                        }).finally(function () {
                            $scope.showLoading = false;
                            $scope.conceptStatus.loading = false;
                            $scope.conceptStatus.searching = false;
                        });
                    };

                    var getConceptsForValueTypeahead = function (viewValue) {
                        $scope.showError = false;
                        $scope.showLoading = true;
                        $scope.conceptStatus.loading = false;
                        $scope.conceptStatus.searching = true;
                        if(mode === REQUEST_MODE.NEW.value){
                            requestType = param;
                        }else{
                            requestId = param;
                        }

                        if ($scope.concept) {
                            $scope.concept.conceptId = null;
                        }
                        if(requestType === REQUEST_TYPE.NEW_CONCEPT){
                            if($scope.concept.sourceTerminology === 'CURRENTBATCH'){
                                return requestService.getBatchConcept(requestId, viewValue).then(function(response){
                                    // if (!isFocused) {
                                    //     validateConceptInput(viewValue);
                                    // }

                                    // remove duplicates
                                    // for (var i = 0; i < response.length; i++) {
                                    //     for (var j = response.length - 1; j > i; j--) {
                                    //         if (response[j].concept.conceptId === response[i].concept.conceptId) {
                                    //             // console.debug(' duplicate ', j, response[j]);
                                    //             response.splice(j, 1);
                                    //             j--;
                                    //         }
                                    //     }
                                    // }
                                    for(var i in response){
                                        response[i].sourceTerminology = $scope.concept.sourceTerminology;
                                    }
                                    return response;
                                }).finally(function () {
                                    $scope.showLoading = false;
                                    $scope.conceptStatus.loading = false;
                                    $scope.conceptStatus.searching = false;
                                });
                            }
                        }
                        

                        // search concepts
                        return snowowlService.findConcepts(null, null, viewValue, 0, 20).then(function (response) {
                            //restore error status
                            if (!isFocused) {
                                validateConceptInput(viewValue);
                            }

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
                        }).finally(function () {
                            $scope.showLoading = false;
                            $scope.conceptStatus.loading = false;
                            $scope.conceptStatus.searching = false;
                        });
                    };

                    var selectConcept = function (conceptItem) {
                        if(conceptItem.sourceTerminology !== 'CURRENTBATCH'){
                             // enable loading
                            $scope.showLoading = true;
                            $scope.showError = false;
                            $scope.conceptStatus.loading = true;
                            $scope.conceptStatus.searching = false;

                            // load concept details.
                            snowowlService.getFullConcept(null, null, conceptItem.concept.conceptId).then(function (response) {
                                $scope.concept = response;
                                if(!conceptItem.sourceTerminology){
                                    $scope.concept.sourceTerminology = 'SNOMEDCT';
                                }else{
                                    $scope.concept.sourceTerminology = conceptItem.sourceTerminology;
                                }
                                for(var name in $scope.concept.relationships){
                                    $scope.concept.relationships[name].viewName = $scope.concept.relationships[name].type.fsn + " " + $scope.concept.relationships[name].target.fsn;
                                }
                                $scope.showError = false;
                                $scope.conceptStatus.valid = true;
                            }, function (error) {
                                $scope.errorMsg = error.msg;
                                $scope.showError = true;
                                $scope.concept = buildInvalidConcept(conceptItem.concept.fsn);
                                $scope.conceptStatus.valid = false;
                            }).finally(function () {
                                $scope.showLoading = false;
                                $scope.conceptStatus.loading = false;
                                $scope.conceptStatus.searching = false;
                            });
                        }else if(conceptItem.sourceTerminology === 'CURRENTBATCH'){
                            $scope.concept.sourceTerminology = conceptItem.sourceTerminology;
                            $scope.concept.conceptId = conceptItem.concept.conceptId;
                            $scope.concept.fsn = conceptItem.concept.fsn;
                        }
                    };

                    var validateConceptInput = function (viewValue) {
                        if ((!($scope.concept && $scope.concept.conceptId) && viewValue) ||
                            (($scope.concept && $scope.concept.conceptId) && !viewValue) ||
                            (($scope.concept && $scope.concept.conceptId) && viewValue && $scope.concept.fsn !== viewValue)) {
                            $scope.showError = true;
                            $scope.concept = buildInvalidConcept(viewValue);
                            $scope.conceptStatus.valid = false;
                        } else {
                            $scope.conceptStatus.valid = true;
                            $scope.showError = false;
                        }
                    };

                    var conceptInputOnBlur = function (event) {
                        if($scope.concept !== null && $scope.concept !== undefined){
                            if($scope.concept.sourceTerminology !== 'CURRENTBATCH'){
                                var viewValue = event.target.value;
                                isFocused = false;
                                validateConceptInput(viewValue);
                            }
                        }
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