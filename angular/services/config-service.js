(function ConfigServiceModule() {
	"use strict";
	
	angular.module('translate.app')
		.factory('configService', ConfigService);
	
	ConfigService.$inject = [];

	var options = {};
	
	function ConfigService() {
		return {
			get: function(key) {
				return options[key];
			},
			set: function(key, value) {
				return options[key] = value;
			},
			getAll: function() {
				return options;
			}
		};
	}
})();