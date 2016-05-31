(function PhraseMappingServiceModule() {
	"use strict";
	
	angular.module('translate.app')
		.factory('phraseMappingService', PhraseMappingService);
	
	PhraseMappingService.$inject = ['configService'];
	
	function PhraseMappingService(configService) {

		return {
			mapPhrase: function (phrase) {
				return configService.get('profile')
					.then(function (profile) {
						if (profile && Array.isArray(profile.translations)) {
							var copy = _.clone(profile.translations);
							copy.sort(function (a, b) { return b.length - a.length; });
							return copy.reduce(function (prev, cur) {
								var needle = new RegExp(escapeRegExp(cur.key), 'g');
								return prev.replace(needle, cur.value);
							}, phrase);
						}
						return phrase;
					});
			}
		};
	}

	function escapeRegExp(str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}
})();