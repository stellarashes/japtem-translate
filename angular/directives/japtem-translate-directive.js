(function JaptemTranslateDirectiveModule() {
	"use strict";

	angular.module('translate.app')
		.directive('japtemTranslate', function() {
			return {
				restrict: 'E',
				controller: 'japtemTranslateController',
				controllerAs: 'vm',
				templateUrl: 'templates/translate.html',
				scope: true
			};
		});
})();