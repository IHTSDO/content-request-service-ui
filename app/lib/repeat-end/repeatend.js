'use strict';

/**
 * @ngdoc directive
 * @name angularjsApp.directive:repeatEnd
 * @description
 * # repeatEnd
 */
 angular.module('conceptRequestServiceApp')
 .directive('repeatEnd', function ($timeout) {
 	return {
 		restrict: 'A',
 		link: function (scope) {
 			if (scope.$last === true) {
 				$timeout(function () {
 					scope.$emit('ngRepeatFinished');
 				});
 			}
 		}
 	};
 });
