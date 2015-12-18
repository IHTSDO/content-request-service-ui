'use strict';

angular
    .module('conceptRequestServiceApp.formControl')
    .directive('formControlReadonly', [
        function () {
            return {
                restrict: 'A',
                scope: {
                    formControlReadonly: '='
                },
                controller: function ($scope) {
                    this.getReadonlyStatus = function () {
                        return $scope.formControlReadonly;
                    }
                },
                link: function ($scope, $element, $attrs) {
                    $scope.$watch('formControlReadonly', function (val) {
                        if (typeof val === 'boolean') {
                            $element.find('input,textarea').prop('readonly', val);
                            $element.find('select').prop('disabled', val);
                            $element.find('input[type=checkbox],input[type=radio]').attr('disabled', val);
                        }
                    });

                }
            }
        }
    ]);