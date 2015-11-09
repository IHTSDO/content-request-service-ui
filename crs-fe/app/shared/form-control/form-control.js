'use strict';

angular
    .module('conceptRequestServiceApp.formControl', [
    ])
    .directive('formControl', [
        function () {
            var buildTextControl = function (label, name, model) {
                var elementHtml = '<div class="form-control-element">' +
                    '<label translate="' + label + '"></label>';

                elementHtml += '<input type="text" class="form-control" name="' + name +
                    '" ng-model="' + model + '">';

                elementHtml += '</div>';

                return elementHtml;
            };

            return {
                restrict: 'E',
                replace: true,
                require: '^form',
                scope: {
                    type: '@',
                    require: '@',
                    multi: '@',
                    label: '@',
                    infoText: '@'
                },
                compile: function ($element, $attrs) {
                    var controlType = $attrs.type;
                    var elementHtml = '';

                    switch (controlType) {
                        case 'concept':
                            break;
                        case 'textarea':
                            break;
                        case 'text':
                        default:
                            elementHtml = buildTextControl($attrs.label, $attrs.name, $attrs.ngModel);
                            break;
                    }

                    $element.html(elementHtml);

                    return function ($scope, $element, $attrs, formCtrl) {

                    };
                }
            }
        }
    ]);