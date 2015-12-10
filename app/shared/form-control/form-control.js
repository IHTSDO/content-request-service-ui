'use strict';

angular
    .module('conceptRequestServiceApp.formControl', [
    ])
    .directive('formControl', [
        function () {
            var buildConceptInputControl = function (label, name, model, required, onConceptChanged) {
                var elementHtml = '<div class="form-control-element" ng-class="{required:' + required +'}">' +
                    '<label translate="' + label + '" ></label>';

                elementHtml += '<concept-input concept="' + model + '" ' + (onConceptChanged?'on-concept-changed="'+ onConceptChanged + '"': '') + '></concept-input>';

                elementHtml += '</div>';

                return elementHtml;
            };

            var buildRelationshipTypeControl = function (label, name, model, required, parentRelationships) {
                var elementHtml = '<div class="form-control-element" ng-class="{required:' + required +'}">' +
                    '<label translate="' + label + '" ></label>';

                elementHtml += '<relationship-type-input type-concept="' + model + '" parents="' + parentRelationships+ '"></relationship-type-input>';

                elementHtml += '</div>';

                return elementHtml;
            };

            var buildTypeaheadControl = function (attrs) {
                var elementHtml = '<div class="form-control-element" ng-class="{required:' + (attrs.required !== undefined && attrs.required !== null) +'}">' +
                    '<label translate="' + attrs.label + '" ></label>';

                elementHtml += '<input type="text" class="form-control" name="' + name +
                    '" ng-model="' + attrs.model + '" maxlength="255" ng-disabled="' + false + '" ';

                for (var attrKey in attrs) {
                    if (attrs.hasOwnProperty(attrKey)) {
                        if (attrKey === 'crsTypeahead') {
                            elementHtml += 'uib-typeahead="' + attrs[attrKey] + '" '
                        } else if (attrKey.indexOf('typeahead') === 0) {
                            elementHtml += angular.lowercase(attrKey.replace(/([A-Z])/g, '-$1')) + '="' + attrs[attrKey] + '" '
                        }
                    }
                }

                elementHtml += '></input>';
                elementHtml += '</div>';

                return elementHtml;
            };


            var buildTextControl = function (label, name, model, required, disabled, isMulti) {

                var elementHtml = '<div class="form-control-element" ng-class="{required:' + required +'}">' +
                    '<label translate="' + label + '" ></label>';

                if (isMulti) {
                    elementHtml += '<multi-input models="' + model + '"></multi-input>';
                } else {
                    elementHtml += '<input type="text" class="form-control" name="' + name +
                        '" ng-model="' + model + '" maxlength="255" ng-disabled="' + disabled + '"></input>';
                }

                elementHtml += '</div>';

                return elementHtml;
            };

            var buildTextAreaControl = function (label, name, model, required, disabled) {
                var elementHtml = '<div class="form-control-element" ng-class="{required:' + required +'}">' +
                    '<label translate="' + label + '" ></label>';

                elementHtml += '<textarea  class="form-control" name="' + name +
                    '" ng-model="' + model + '" maxlength="4000" ng-disabled="' + disabled + '"></textarea>';

                elementHtml += '</div>';

                return elementHtml;
            };

            var buildDropdownControl = function (label, name, model, options, required, disabled) {
                var elementHtml = '<div class="form-control-element" ng-class="{required:' + required +'}">' +
                    '<label translate="' + label + '" ></label>';

                elementHtml += '<select class="form-control" name="' + name +
                    '" ng-model="' + model +
                    '" ng-options="' + options+ '" ng-disabled="' + disabled + '"></select>';

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
                    var multi = $attrs.multi;
                    var elementHtml = '';

                    switch (controlType) {
                        case 'concept':
                            elementHtml = buildConceptInputControl($attrs.label,
                                $attrs.name,
                                $attrs.model,
                                ($attrs.required !== undefined && $attrs.required !== null),
                                $attrs.onConceptChanged);
                            break;
                        case 'relationshipType':
                            elementHtml = buildRelationshipTypeControl($attrs.label,
                                $attrs.name,
                                $attrs.model,
                                ($attrs.required !== undefined && $attrs.required !== null),
                                $attrs.parentRelationships);
                            break;
                        case 'typeahead':
                            elementHtml = buildTypeaheadControl($attrs);
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
                                ($attrs.required !== undefined && $attrs.required !== null),
                                false, // disabled
                                (multi === 'true'));
                            break;
                    }

                    $element.html(elementHtml);

                    return function ($scope, $element, $attrs, formCtrl) {

                    };
                }
            }
        }
    ]);