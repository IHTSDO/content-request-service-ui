'use strict';

angular
    .module('conceptRequestServiceApp.formControl')
    .directive('multiTextarea', [
        function () {
            return {
                restrict: 'E',
                require: ['?^formControlReadonly', '^form'],
                scope: {
                    models: '='
                },
                template: [
                    '<div class="row" style="margin-left: -15px;margin-right: -15px;margin-bottom: 10px" ng-repeat="model in models track by $index" >',
                    '<div class="{{readonly?\'col-md-12\':\'col-md-10\'}}"><textarea maxlength="4000" id="auto-resize" class="form-control animate msd-elastic: \n;" ng-model="models[$index]" ng-readonly="readonly"></textarea></div>',
                    '<div ng-if="!readonly" class="col-md-2">',
                    '<button type="button" ng-click="addField($index)" tabindex="-1"',
                    'class="btn-default add-buttons md fa fa-plus button-width-plus pull-right tooltips-left tooltips-light normal-case"></button>',
                    '<button type="button" ng-click="removeField($index)" ng-if="models.length > 1" tabindex="-1"',
                    'class="btn-default add-buttons md fa fa-minus button-width-minus pull-right tooltips-left tooltips-light normal-case"></button>',
                    '</div></div>'
                ].join(''),
                link: function ($scope, $element, $attrs, reqiredControllers) {
                    var formControlReadonlyCtrl = reqiredControllers[0];
                    $scope.readonly = false;

                    if (formControlReadonlyCtrl) {
                        $scope.readonly = formControlReadonlyCtrl.getReadonlyStatus();
                    }

                    if (!angular.isArray($scope.models) || $scope.models.length === 0) {
                        $scope.models = [''];
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