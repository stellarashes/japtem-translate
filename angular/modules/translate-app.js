(function TranslateAppModule() {
	"use strict";

	angular.module('translate.app', ['ngRoute'])
		.config(TranslateAppConfig);

	TranslateAppConfig.$inject = ['$routeProvider'];

	function TranslateAppConfig($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'pages/translate-page.html'
			})

			.when('/config', {
				templateUrl: 'pages/config-page.html'
			})
		;
	}


})();