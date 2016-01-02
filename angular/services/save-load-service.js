(function SaveLoadServiceModule() {
	"use strict";

	angular.module('translate.app')
		.factory('saveLoadService', SaveLoadService);

	SaveLoadService.$inject = ['fileSystemService'];

	function SaveLoadService(fs) {
		return {
			save: function(data) {
				return fs.saveToFile(data);
			},

			load: function() {
				return fs.readTextFile()
					.then(function (result) {
						return result.data;
					});
			}
		};
	}
})();