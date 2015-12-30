(function JaptemConfigControllerModule() {
	"use strict";

	angular.module('translate.app')
		.controller('japtemConfigController', JaptemConfigController);

	JaptemConfigController.$inject = ['ttsService', 'configService'];

	function JaptemConfigController(ttsService, configService) {
		var vm = this;

		vm.languages = [];
		vm.update = update;

		ttsService.getVoices()
			.then(processVoices);

		configService.get('lang')
			.then(function (result) {
				vm.selectedLang = result || 'ja-JP';
			});

		configService.get('rate')
			.then(function (result) {
				vm.ttsRate = result || 0.8;
			});

		function processVoices(voices) {
			vm.languages = voices.filter(filter);

			function filter(current) {
				return current.hasOwnProperty('lang') && current.hasOwnProperty('voiceName');
			}
		}

		function update() {
			configService.set({
				lang: vm.selectedLang,
				rate: parseFloat(vm.ttsRate)
			});
		}
	}
})();