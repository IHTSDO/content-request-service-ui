'use strict';

angular
    .module('conceptRequestServiceApp.formControl')
    .directive('authorInput', [
        'crsJiraService',
        function (crsJiraService) {
            return {
                restrict: 'E',
                require: ['?^formControlReadonly', '^form'],
                scope: {
                    author: '=',
                    authorStatus: '=',
                    authors: '=authorList',
                    onAuthorChanged: '&'
                },
                template: [
                    '<div class="no-padding" style="position:relative">',
                    '<input class="form-control" type="text" style="margin-top:2px;padding-right:30px;min-height:37px!important;{{(author && author.avatarUrls)?\'padding-left:42px;background:url(\' + author.avatarUrls[\'32x32\'] + \') no-repeat\':\'\'}}" ',
                    'ng-model="author" ',
                    'ng-blur="authorInputOnBlur($event)" ng-focus="authorInputOnFocus($event)"',
                    'uib-typeahead="author as author.displayName for author in authors | filter:{displayName:$viewValue}" ',
                    //'typeahead-focus ',
                    'author-input-focus ',
                    'typeahead-focus-first="false" ',
                    'typeahead-on-select="selectAuthor($item)" ',
                    'typeahead-template-url="authorInputItemTemplate.html" ',
                    'typeahead-editable="false" typeahead-min-length="0"/>',
                    '<span style="top:0;position: absolute;padding-top:3px;right:5px;font-size:14px;{{(showError)?\'color:red\':\'\'}}" ' +
                        'ng-show="showLoading || showError" ' +
                        'class="md" ' +
                        'ng-class="{\'md-spin md-autorenew\':showLoading, \'md-error\':showError}"></span>',
                    '</div>'
                ].join(''),
                link: function ($scope, $element, $attrs, reqiredControllers) {
                    var formControlReadonlyCtrl = reqiredControllers[0];
                    var isFocused = false;

                    var initControl = function () {
                        $scope.showLoading = false;
                        $scope.showError = false;

                        if (!$scope.authorStatus) {
                            $scope.authorStatus = {
                                loading: false,
                                searching: false,
                                valid: false
                            };
                        }

                        if ($scope.author &&
                            ($scope.author.name || $scope.author.displayName)) {
                            dropAuthor({id:$scope.author.name, fsn:$scope.author.displayName});
                        }

                        if (formControlReadonlyCtrl) {
                            $scope.readonly = formControlReadonlyCtrl.getReadonlyStatus();
                        }

                        if (!$scope.authors) {
                            loadAuthors();
                        }
                    };

                    var loadAuthors = function () {
                        $scope.showError = false;
                        $scope.showLoading = true;
                        $scope.authorStatus.loading = false;
                        $scope.authorStatus.searching = true;
                        $scope.authors = [];

                        if ($scope.author) {
                            $scope.author.name= null;
                        }

                        // search authors
                        return crsJiraService.getAuthorUsers(0, 10, true, []).then(function (users) {
                            $scope.authors = users;

                            return users;
                        }).finally(function () {
                            $scope.showLoading = false;
                            $scope.authorStatus.loading = false;
                            $scope.authorStatus.searching = false;
                        });
                    };

                    var dropAuthor = function (authorData) {
                        $scope.author = authorData;
                    };

                    var getAuthorsForValueTypeahead = function () {
                        $scope.showError = false;
                        $scope.showLoading = true;
                        $scope.authorStatus.loading = false;
                        $scope.authorStatus.searching = true;

                        if ($scope.author) {
                            $scope.author.name = null;
                        }

                        // search authors
                        return crsJiraService.getAuthorUsers(0, 10, true, []).then(function (users) {
                            //restore error status
                            /*if (!isFocused) {
                                validateAuthorInput(viewValue);
                            }*/

                            return users;
                        }).finally(function () {
                            $scope.showLoading = false;
                            $scope.authorStatus.loading = false;
                            $scope.authorStatus.searching = false;
                        });
                    };

                    var selectAuthor = function (authorItem) {
                        $scope.author = authorItem;
                        $scope.showError = false;
                    };

                    var authorInputOnBlur = function (event) {
                        var viewValue = event.target.value;
                        isFocused = false;

                        $scope.showError = (viewValue && (!$scope.author || !$scope.author.name));
                    };

                    var authorInputOnFocus = function () {
                        isFocused = true;
                    };

                    if (angular.isFunction($scope.onAuthorChanged)) {
                        $scope.$watch('author', function (newAuthor, currentAuthor) {
                            if (newAuthor &&
                                newAuthor !== currentAuthor) {
                                $scope.onAuthorChanged({
                                    author: newAuthor
                                });
                            }
                        });
                    }

                    $scope.readonly = false;
                    $scope.dropAuthor = dropAuthor;
                    $scope.selectAuthor = selectAuthor;
                    $scope.getAuthorsForValueTypeahead = getAuthorsForValueTypeahead;
                    $scope.authorInputOnBlur = authorInputOnBlur;
                    $scope.authorInputOnFocus = authorInputOnFocus;

                    initControl();
                }
            };
        }
    ])
    .run([
        '$templateCache',
        function ($templateCache) {
            $templateCache.put('authorInputItemTemplate.html', [
                '<a>',
                '<img width="16" height="16" ng-src="{{match.model.avatarUrls[\'32x32\']}}" >',
                '<span ng-bind-html="match.model.displayName | uibTypeaheadHighlight:query" style="margin-left: 10px"></span>',
                '</a>'
            ].join(''));
        }
    ]);