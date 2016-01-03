(function JaptemKeybindDirectiveModule() {
	"use strict";

	angular.module('translate.app')
		.directive('japtemKeybind', function() {
			return {
				restrict: 'E',
				controller: 'japtemKeybindController',
				controllerAs: 'vm',
				templateUrl: 'templates/keybinds.html',
				scope: true
			};
		});
})();