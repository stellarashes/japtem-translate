(function JaptemConfigControllerModule() {
	"use strict";

	angular.module('translate.app')
		.controller('japtemConfigController', JaptemConfigController);

	JaptemConfigController.$inject = ['ttsService', 'configService', 'fileSystemService', '$timeout'];

	function JaptemConfigController(ttsService, configService, fileSystemService, $timeout) {
		var vm = this;

		vm.languages = [];
		vm.update = update;
		vm.openProfile = openProfile;
		vm.profile = null;
		vm.addMapRow = addMapRow;
		vm.removeRow = removeRow;

		ttsService.getVoices()
			.then(processVoices);

		configService.get(['lang', 'rate', 'profile', 'skipRaws'])
			.then(function (result) {
				vm.selectedLang = result.lang || 'ja-JP';
				vm.ttsRate = result.rate || 0.8;
				vm.profile = result.profile;
				vm.skipRaws = result.skipRaws;
			});

		var element = document.querySelector('.profile-edit-container');
		$timeout(function() {
			element.scrollTop = element.scrollHeight;
		});

		function processVoices(voices) {
			vm.languages = voices.filter(filter);

			function filter(current) {
				return current.hasOwnProperty('lang') && current.hasOwnProperty('voiceName') && current.hasOwnProperty('gender') && current.gender === 'female';
			}
		}

		function update() {
			configService.set({
				lang: vm.selectedLang,
				rate: parseFloat(vm.ttsRate),
				profile: vm.profile,
				skipRaws: vm.skipRaws
			});
		}

		function openProfile() {
			fileSystemService.readTextFile()
				.then(function (file) {
					var parsed = CSV.parse(file.data);
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


					vm.profile = {
						name: file.entry.name,
						translations: translations
					};

					vm.update();
				});
		}

		function addMapRow() {
			if (!vm.mapRowAddKey || !vm.mapRowAddValue) {
				return;
			}
			vm.profile.translations.push({
				key: vm.mapRowAddKey,
				value: vm.mapRowAddValue
			});
			vm.update();
			vm.mapRowAddKey = '';
			vm.mapRowAddValue = '';
		}

		function removeRow(index) {
			vm.profile.translations.splice(index, 1);
			vm.update();
		}
	}
})();