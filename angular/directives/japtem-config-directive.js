(function JaptemConfigDirectiveModule() {
	"use strict";

	angular.module('translate.app')
		.directive('japtemConfig', function() {
			return {
				restrict: 'E',
				controller: 'japtemConfigController',
				controllerAs: 'vm',
				templateUrl: 'templates/config.html',
				scope: true
			};
		});
})();