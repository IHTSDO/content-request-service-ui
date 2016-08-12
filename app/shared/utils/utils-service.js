'use strict';

var app = angular.module('conceptRequestServiceApp.utils', []);
app.factory('utilsService', function() {
	
	var factory = {};
   
	factory.compareStrings = function(a, b) {
		// Assuming you want case-insensitive comparison
		a = a.toLowerCase();
		b = b.toLowerCase();

		return (a < b) ? -1 : (a > b) ? 1 : 0;
	};
		
	return factory;
});