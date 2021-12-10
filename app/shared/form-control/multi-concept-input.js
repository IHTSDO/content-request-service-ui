'use strict';

angular
    .module('conceptRequestServiceApp.formControl')
    .directive('multiConceptInput', [
        '$routeParams',
        function ($routeParams) {
            return {
                restrict: 'E',
                require: ['?^formControlReadonly', '^form'],
                scope: {
                    models: '=',
                    hideAction: '=',
                    skipFilter: '='
                },
                template: [
                    '<div class="row" style="margin-left: -15px;margin-right: -15px;margin-bottom: 10px" ng-repeat="model in models track by $index" >',
                    '<div class="{{hideAction?\'col-md-8\':(readonly?\'col-md-8\':\'col-md-6\')}}">',
                    '<concept-input skip-filter="skipFilter" concept="models[$index]" on-concept-changed="" readonly="" concept-status="" ></concept-input>',
                    '</div>',
                    '<div class="{{readonly?\'col-md-4\':\'col-md-4\'}}">',
                    '<select class="form-control" ng-model="models[$index].sourceTerminology" ng-options="suggestion.sourceTerminology as suggestion.label for suggestion in sourceTerminologies"></select>',
                    '</div>',
                    '<div ng-if="!readonly" class="col-md-2">',
                    '<button type="button" ng-if="!hideAction" ng-click="addField($index)" tabindex="-1"',
                    'class="btn-default add-buttons md fa fa-plus button-width-plus pull-right tooltips-left tooltips-light normal-case"></button>',
                    '<button type="button" ng-click="removeField($index)" ng-if="models.length > 1 && !hideAction" tabindex="-1"',
                    'class="btn-default add-buttons md fa fa-minus button-width-minus pull-right tooltips-left tooltips-light normal-case"></button>',
                    '</div></div>'
                ].join(''),
                link: function ($scope, $element, $attrs, reqiredControllers) {
                    var formControlReadonlyCtrl = reqiredControllers[0];
                    var mode = $routeParams.mode;

                    if (formControlReadonlyCtrl) {
                        $scope.readonly = formControlReadonlyCtrl.getReadonlyStatus();
                    }

                    if (!angular.isArray($scope.models) || $scope.models.length === 0) {
                        $scope.models = [{}];
                    }

                    $scope.sourceTerminologies = [
                        {
                            label: 'SNOMED CT',
                            sourceTerminology: 'SNOMEDCT'
                        },
                        {   
                            label: 'Current Batch',
                            sourceTerminology: 'CURRENTBATCH'
                        },
                        {
                            label: 'New Concept Requests',
                            sourceTerminology: 'NEWCONCEPTREQUESTS'
                        }
                    ];

                    if(mode === 'new'){
                        $scope.sourceTerminologies.splice(1, 1);
                    }

                    $scope.addField = function (index) {
                        $scope.models.splice(index + 1, 0, '');
                    };

                    $scope.removeField = function (index) {
                        $scope.models.splice(index, 1);
                    };
                }
            };
        }
    ]);