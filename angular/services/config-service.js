(function ConfigServiceModule() {
	"use strict";
	
	angular.module('translate.app')
		.factory('configService', ConfigService);
	
	ConfigService.$inject = ['$q', 'storageService'];

	var options = {};
	
	function ConfigService($q, storageService) {
		var self = this;
		this.ready = false;
		this.promise = null;

		return {
			get: function(key) {
				return init().then(function() {
					return options[key];
				});
			},
			set: function(key, value) {
				return init().then(function() {
					if (typeof(key) === 'object') {
						options = _.merge(options, key);
					} else {
						options[key] = value;
					}
					return storageService.set(options);
				});
			},
			getAll: function() {
				return init().then(function() {
					return options;
				});
			}
		};

		function init() {
			if (self.ready) {
				return $q.resolve(options);
			} else {
				if (self.promise === null) {
					self.promise = storageService.get(['rate', 'lang', 'profile'])
						.then(function (result) {
							options = result;
							self.ready = true;
						});
					return self.promise;
				} else {
					return self.promise;
				}
			}
		}
	}
})();