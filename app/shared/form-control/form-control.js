'use strict';

angular
    .module('conceptRequestServiceApp.formControl', [
    ])
    .directive('formControl', [
        function () {
            var buildTextControl = function (label, name, model, required) {
                var elementHtml = '<div class="form-control-element" ng-class="{required:' + required +'}">' +
                    '<label translate="' + label + '" ></label>';

                elementHtml += '<input type="text" class="form-control" name="' + name +
                    '" ng-model="' + model + '"></input>';

                elementHtml += '</div>';

                return elementHtml;
            };

            var buildTextAreaControl = function (label, name, model, required) {
                var elementHtml = '<div class="form-control-element" ng-class="{required:' + required +'}">' +
                    '<label translate="' + label + '" ></label>';

                elementHtml += '<textarea  class="form-control" name="' + name +
                    '" ng-model="' + model + '"></textarea>';

                elementHtml += '</div>';

                return elementHtml;
            };

            var buildDropdownControl = function (label, name, model, options, required) {
                var elementHtml = '<div class="form-control-element" ng-class="{required:' + required +'}">' +
                    '<label translate="' + label + '" ></label>';

                elementHtml += '<select class="form-control" name="' + name +
                    '" ng-model="' + model +
                    '" ng-options="' + options+ '"></select>';

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
                        case 'select':
                        case 'dropdown':
                            elementHtml = buildDropdownControl($attrs.label,
                                $attrs.name,
                                $attrs.model,
                                $attrs.options,
                                ($attrs.required !== undefined && $attrs.required !== null));
                            break;
                        case 'area':
                        case 'textarea':
                            elementHtml = buildTextAreaControl($attrs.label,
                                $attrs.name,
                                $attrs.model,
                                ($attrs.required !== undefined && $attrs.required !== null));
                            break;
                        case 'text':
                        default:
                            elementHtml = buildTextControl($attrs.label,
                                $attrs.name,
                                $attrs.model,
                                ($attrs.required !== undefined && $attrs.required !== null));
                            break;
                    }

                    $element.html(elementHtml);

                    return function ($scope, $element, $attrs, formCtrl) {

                    };
                }
            }
        }
    ]);