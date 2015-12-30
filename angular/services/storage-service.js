(function StorageServiceModule() {
	"use strict";
	
	angular.module('translate.app')
		.factory('storageService', StorageService);
	
	StorageService.$inject = ['$q'];
	
	function StorageService($q) {
		return {
			set: function(objToSet) {
				var deferred = $q.defer();
				chrome.storage.local.set(objToSet, function() {
					if (chrome.runtime.lastError) {
						deferred.reject(chrome.runtime.lastError);
					} else {
						deferred.resolve();
					}
				});

				return deferred.promise;
			},
			get: function(key) {
				var deferred = $q.defer();
				chrome.storage.local.get(key, function(result) {
					if (chrome.runtime.lastError) {
						deferred.reject(chrome.runtime.lastError);
					} else {
						deferred.resolve(result);
					}
				});

				return deferred.promise;
			}
		};
	}
})();