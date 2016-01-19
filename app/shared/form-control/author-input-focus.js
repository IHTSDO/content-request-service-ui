'use strict';

angular
    .module('conceptRequestServiceApp.formControl')
    .directive('authorInputFocus', [
        function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, element, attr, ngModel) {

                    //trigger the popup on 'click' because 'focus'
                    //is also triggered after the item selection
                    element.bind('click', function () {

                        // console.debug('typeaheadFocus click event', ngModel.$viewValue);

                        var viewValue = ngModel.$viewValue;
                        //var modelValue = ngModel.$modelValue;

                        //restore to null value so that the typeahead can detect a change
                        if (viewValue === ' ') {
                            ngModel.$setViewValue(null);
                        }

                        if (!viewValue) {
                            //force trigger the popup
                            ngModel.$setViewValue(' ');

                            //set the actual value in case there was already a value in the input
                            ngModel.$setViewValue(viewValue || ' ');
                        }
                    });

                    /*//compare function that treats the empty space as a match
                    scope.emptyOrMatch = function (actual, expected) {
                        // console.debug('emptyormatch', actual, expected);
                        if (expected === ' ') {
                            return true;
                        }
                        return actual ? actual.toString().toLowerCase().indexOf(expected.toLowerCase()) > -1 : false;
                    };*/
                }
            };
        }]
);
