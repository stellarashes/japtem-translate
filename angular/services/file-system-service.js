(function FileSystemServiceModule() {
	"use strict";

	angular.module('translate.app')
		.factory('fileSystemService', FileSystemService);

	FileSystemService.$inject = ['$q'];

	function FileSystemService($q) {
		return {
			readTextFile: function () {
				var deferred = $q.defer();
				chrome.fileSystem.chooseEntry({
						type: 'openFile',
						accepts: [
							{
								description: 'Text based files (*.txt, *.json, *.csv)',
								extensions: ['txt', 'json', 'csv']
							}
						]
					},
					function (entry) {
						entry.file(function (file) {
							var reader = new FileReader();

							reader.onerror = function (err) {
								deferred.reject(err);
							};

							reader.onloadend = function (e) {
								deferred.resolve(
									{
										entry: entry,
										data: e.target.result
									}
								);
							};

							reader.readAsText(file);
						});
					}
				);

				return deferred.promise;
			},

			saveToFile: function (data, description, extensions, type) {
				description = description || 'Text based files (*.json)';
				extensions = extensions || ['json'];
				type = type || 'application/json';
				var deferred = $q.defer();
				chrome.fileSystem.chooseEntry({
						type: 'saveFile',
						accepts: [
							{
								description: description,
								extensions: extensions
							}
						]
					},
					function (entry) {
						entry.createWriter(function (writer) {
							writer.onerror = function (err) {
								deferred.reject(err);
							};
							writer.onwriteend = function() {
								deferred.resolve();
							};

							writer.write(new Blob([data]), type);
						});
					});

				return deferred.promise;
			}
		};
	}
})();