(function ProfileServiceModule() {
	"use strict";

	angular.module('translate.app')
		.factory('profileService', ProfileService);

	ProfileService.$inject = ['fileSystemService'];

	function ProfileService(fs) {
		return {
			open: function() {
				return fs.readTextFile()
					.then(function (file) {
						var parsed = Papa.parse(file.data).data;
						var translations = [];
						for (var i = 0; i < parsed.length; i++) {
							var obj = parsed[i];
							if (!Array.isArray(obj) || obj.length < 2) {
								continue;
							}

							translations.push({
								key: obj[0],
								value: obj[1]
							});
						}

						return  {
							name: file.entry.name,
							translations: translations
						};
					});
			},

			save: function(profile) {
				if (!profile || !profile.translations) {
					return;
				}

				var data = profile.translations.reduce(function (prev, cur) {
					prev.push([cur.key, cur.value]);
					return prev;
				}, []);

				var csv = Papa.unparse(data);
				return fs.saveToFile(csv, 'Profile (*.csv)', ['csv'], 'text/csv');
			}
		};
	}
})();