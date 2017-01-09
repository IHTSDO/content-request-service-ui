'use strict';
angular.module('conceptRequestServiceApp.request')
    .directive('dropDisable', [
        function () {
            return {
                restrict: 'A',
                link: function(scope, element) {
                    var handler = function(event) {
                        event.preventDefault();
                        return false;
                    };

                    element.on('dragenter', handler);
                    element.on('dragover', handler);
                    element.on('drop', handler);
                }
            };
        }]
    );