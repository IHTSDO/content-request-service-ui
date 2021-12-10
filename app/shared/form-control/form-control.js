'use strict';

angular
    .module('conceptRequestServiceApp.formControl', [
    ])
    .directive('formControl', [
        function () {
            var buildConceptInputControl = function (name, model, onConceptChanged, isMulti, readonlyExp, conceptStatusExp, hideAction, skipFilter) {
                var elementHtml = '';
                if (isMulti) {
                    // elementHtml += '<multi-concept-input models="' + model + '" ' + ((readonlyExp)?'readonly="' + readonlyExp +'"':'') + ' readonly=""></multi-concept-input>';
                    elementHtml += '<multi-concept-input models="' + model + '"' +
                    (onConceptChanged?' on-concept-changed="'+ onConceptChanged + '"': '') +
                    ((readonlyExp)?' readonly="' + readonlyExp +'" ':'') +
                    ((conceptStatusExp)?' concept-status="' + conceptStatusExp +'"':'') +
                        ' hide-action="' + hideAction + '" skip-filter="' + skipFilter +'" ></multi-concept-input>';
                } else {
                    elementHtml += '<concept-input concept="' + model + '"' +
                    (onConceptChanged?' on-concept-changed="'+ onConceptChanged + '"': '') +
                    ((readonlyExp)?' readonly="' + readonlyExp +'" ':'') +
                    ((conceptStatusExp)?' concept-status="' + conceptStatusExp +'"':'') +
                    ' ></concept-input>';
                }
                 
                    return elementHtml;
            };

            var buildAttributeValueInputControl = function (name, domainAttribute, model, onConceptChanged, readonlyExp, conceptStatusExp) {
                return '<attribute-value-input concept="' + model + '"' +
                    (onConceptChanged?' on-concept-changed="'+ onConceptChanged + '"': '') +
                    ((readonlyExp)?' readonly="' + readonlyExp +'" ':'') +
                    ((conceptStatusExp)?' concept-status="' + conceptStatusExp +'"':'') +
                    ((domainAttribute)?' domain-attribute="' + domainAttribute +'"':'') +
                    ' ></concept-input>';
            };

            var buildAuthorInputControl = function (name, model, authorList, onConceptChanged, readonlyExp, authorStatusExp) {
                return '<author-input author="' + model + '"' +
                    (onConceptChanged?' on-author-changed="'+ onConceptChanged + '"': '') +
                    ((readonlyExp)?' readonly="' + readonlyExp +'" ':'') +
                    ((authorStatusExp)?' author-status="' + authorStatusExp +'"':'') +
                    ((authorList)?' author-list="' + authorList +'"':'') +
                    ' ></author-input>';
            };

            var buildRelationshipTypeControl = function (name, model, parentRelationships, readonlyExp) {
                return '<relationship-type-input type-concept="' + model +
                    '" parents="' + parentRelationships +
                    ((readonlyExp)?'readonly="' + readonlyExp +'" ':'') +
                    '"></relationship-type-input>';
            };

            var buildTypeaheadControl = function (attrs) {
                var readonlyExp = attrs.readonly;
                var elementHtml = '';

                elementHtml += '<input type="text" class="form-control"'+
                    ' ng-model="' + attrs.model + '" maxlength="255" ';

                elementHtml += ((readonlyExp)?'readonly="' + readonlyExp +'" ':'');

                for (var attrKey in attrs) {
                    if (attrs.hasOwnProperty(attrKey)) {
                        if (attrKey === 'crsTypeahead') {
                            elementHtml += 'uib-typeahead="' + attrs[attrKey] + '" ';
                        } else if (attrKey.indexOf('typeahead') === 0) {
                            elementHtml += angular.lowercase(attrKey.replace(/([A-Z])/g, '-$1')) + '="' + attrs[attrKey] + '" ';
                        }
                    }
                }

                elementHtml += '></input>';

                return elementHtml;
            };

            var buildTextAngularControl = function (attrs) {
                var readonlyExp = attrs.readonly;
                var elementHtml = '';

                elementHtml += '<text-angular class="no-shadow"' +
                    ' ng-model="' + attrs.model + '" ';

                elementHtml += ((readonlyExp)?'readonly="' + readonlyExp +'" ':'');

                for (var attrKey in attrs) {
                    if (attrs.hasOwnProperty(attrKey)) {
                        if (attrKey.indexOf('ta') === 0) {
                            elementHtml += angular.lowercase(attrKey.replace(/([A-Z])/g, '-$1')) + '="' + attrs[attrKey] + '" ';
                        }
                    }
                }

                elementHtml += '></text-angular>';

                return elementHtml;
            };


            var buildTextControl = function (name, model, isMulti, readonlyExp) {
                var elementHtml = '';

                if (isMulti) {
                    elementHtml += '<multi-input models="' + model + '" ' + ((readonlyExp)?'readonly="' + readonlyExp +'"':'') + ' readonly="" drop-disable></multi-input>';
                } else {
                    elementHtml += '<input id="dropAble" type="text" class="form-control" name="' + name +
                        '" ng-model="' + model + '" maxlength="255" ' + ((readonlyExp)?'ng-readonly="' + readonlyExp +'"':'') + ' drop-disable></input>';
                }

                return elementHtml;
            };

            var buildTextReadonly = function (name, model) {
                var elementHtml = '';
                    elementHtml += '<div class="comment-body">{{' + model + '}}</div>';
                return elementHtml;
            };

            var buildTextAreaControl = function (name, model,isMulti, readonlyExp) {
                var elementHtml = '';
                if (isMulti) {
                    elementHtml += '<multi-textarea name="' + name +
                    '" models="' + model + '" ' + ((readonlyExp)?'ng-readonly="' + readonlyExp +'"':'') + ' drop-disable></textarea>';
                }else{
                    elementHtml += '<textarea  class="form-control animate msd-elastic: \n;" name="' + name +
                    '" ng-model="' + model + '" maxlength="4000" ' + ((readonlyExp)?'ng-readonly="' + readonlyExp +'"':'') + ' drop-disable></textarea>';
                }
                return elementHtml;
            };

            var buildDropdownControl = function (name, model, options, readonlyExp) {
                return '<select class="form-control" name="' + name +
                    '" ng-model="' + model +
                    '" ng-options="' + options+ '" ' + ((readonlyExp)?'ng-disabled="' + readonlyExp +'"':'') + ' ></select>' +
                    '<span ng-if="' + model + ' !== null &&' + model + ' !== undefined && requestVM.request.requestHeader.status === \'DRAFT\'" ' + ((readonlyExp)?'ng-disabled="' + readonlyExp +'"':'') + ' class="clear-dropdown-value md md-close" title="{{ \'tooltips.request.details.button.clearDropdownList\' | translate}}" ng-click="' + model + ' = null">';
            };

            var buildControlLabel = function (controlElement, label, required, errorModel, loadingMsg) {
                var elBuilder = [
                        '<div class="form-control-element" ng-class="{required:' + required +', \'form-control-error\': ' + errorModel +'}">'
                ];

                if (label) {
                    elBuilder = elBuilder.concat([
                        '<label translate="' + label + '" ></label>',
                        '<span ng-if="' + errorModel +'" translate="{{' + errorModel+ '}}" style="color:#a94442;padding-left:5px"></span>']);
                }

                elBuilder.push(controlElement);

                if (loadingMsg) {
                    elBuilder.push('<div ng-if="' + loadingMsg +
                        '" style="position:absolute;top:0;right:0;bottom:0;left:0;font-size:14px;">' +
                        '<span style="position:absolute;right:15px;bottom:3px" class="md md-spin md-autorenew"></span></div>');
                }

                elBuilder.push('</div>');
                return elBuilder.join('');
            };

            return {
                restrict: 'E',
                replace: true,
                require: '^form',
                scope: {
                    /*type: '@',
                    require: '@',
                    multi: '@',
                    label: '@',
                    infoText: '@'*/
                },
                compile: function ($element, $attrs) {
                    var controlType = $attrs.type;
                    var multi = $attrs.multi;
                    var elementHtml = '';

                    switch (controlType) {
                        case 'concept':
                            elementHtml = buildConceptInputControl(
                                $attrs.name,
                                $attrs.model,
                                $attrs.onConceptChanged,
                                (multi === 'true'),
                                $attrs.readonly,
                                $attrs.conceptStatus,
                                ($attrs.hideaction === 'true'),
                                ($attrs.skipfilter === 'true'));
                            break;
                        case 'attributeValue':
                            elementHtml = buildAttributeValueInputControl(
                                $attrs.name,
                                $attrs.domainAttribute,
                                $attrs.model,
                                $attrs.onConceptChanged,
                                $attrs.readonly,
                                $attrs.conceptStatus);
                            break;
                        case 'author':
                            elementHtml = buildAuthorInputControl(
                                $attrs.name,
                                $attrs.model,
                                $attrs.authorList,
                                $attrs.onAuthorChanged,
                                $attrs.readonly,
                                $attrs.authorStatus);
                            break;
                        case 'relationshipType':
                            elementHtml = buildRelationshipTypeControl(
                                $attrs.name,
                                $attrs.model,
                                $attrs.parentRelationships,
                                $attrs.readonly);
                            break;
                        case 'typeahead':
                            elementHtml = buildTypeaheadControl($attrs);
                            break;
                        case 'select':
                        case 'dropdown':
                            elementHtml = buildDropdownControl(
                                $attrs.name,
                                $attrs.model,
                                $attrs.options,
                                $attrs.readonly);
                            break;
                        case 'area':
                        case 'textarea':
                            elementHtml = buildTextAreaControl(
                                $attrs.name,
                                $attrs.model,
                                (multi === 'true'),
                                $attrs.readonly);
                            break;
                        case 'textangular':
                            elementHtml = buildTextAngularControl($attrs);
                            break;
                        case 'text':
                            elementHtml = buildTextControl(
                                $attrs.name,
                                $attrs.model,
                                (multi === 'true'),
                                $attrs.readonly);
                            break;
                        case 'text-readonly':
                            elementHtml = buildTextReadonly(
                                $attrs.name,
                                $attrs.model,
                                (multi === 'true'),
                                $attrs.readonly);
                            break;
                    }

                    elementHtml = buildControlLabel(elementHtml,
                        $attrs.label,
                        ($attrs.required !== undefined && $attrs.required !== null),
                        $attrs.errorModel,
                        $attrs.loadingMask);

                    $element.html(elementHtml);

                    /*return function ($scope, $element, $attrs, formCtrl) {
                    };*/
                }
            };
        }
    ]);