(function JaptemConfigControllerModule() {
	"use strict";

	angular.module('translate.app')
		.controller('japtemConfigController', JaptemConfigController);

	JaptemConfigController.$inject = ['ttsService', 'configService', 'profileService', '$timeout'];

	function JaptemConfigController(ttsService, configService, profileService, $timeout) {
		var vm = this;

		vm.languages = [];
		vm.update = update;
		vm.newProfile = function () {
			vm.profile = {
				name: 'New',
				translations: []
			};

			vm.update();
		}
		vm.openProfile = openProfile;
		vm.saveProfile = saveProfile;
		vm.profile = null;
		vm.addMapRow = addMapRow;
		vm.removeRow = removeRow;

		ttsService.getVoices()
			.then(processVoices);

		configService.getAll()
			.then(function (result) {
				vm.selectedLang = result.lang || 'ja-JP';
				vm.ttsRate = result.rate || 0.8;
				vm.profile = result.profile || {
						name: 'New',
						translations: []
					};
				vm.skipRaws = result.skipRaws;
				if (!result || !Object.keys(result).length) {
					update();
				}
				vm.alwaysOnTop = result.alwaysOnTop;
				vm.statusBar = result.statusBar;
			});

		var element = document.querySelector('.profile-edit-container');
		$timeout(function() {
			element.scrollTop = element.scrollHeight;
		});

		function processVoices(voices) {
			vm.languages = voices.filter(filter);

			function filter(current) {
				return current.hasOwnProperty('lang') && current.hasOwnProperty('voiceName');
			}
		}

		function update() {
			var voiceName = null;
			for (var i = 0; i < vm.languages.length; i++) {
				var obj = vm.languages[i];
				if (obj.lang === vm.selectedLang) {
					voiceName = obj.voiceName;
					break;
				}
			}

			configService.set({
				lang: vm.selectedLang,
				voiceName: voiceName || 'Google 日本語',
				rate: parseFloat(vm.ttsRate),
				profile: vm.profile,
				skipRaws: vm.skipRaws,
				alwaysOnTop: vm.alwaysOnTop,
				statusBar: vm.statusBar
			});
		}

		function openProfile() {
			profileService.open()
				.then(function (profile) {
					vm.profile = profile;
					vm.update();
				});
		}

		function saveProfile() {
			profileService.save(vm.profile);
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