(function JaptemTranslateControllerModule() {
	"use strict";

	angular.module('translate.app')
		.controller('japtemTranslateController', JaptemTranslateController);

	JaptemTranslateController.$inject = ['ttsService', 'configService'];

	function JaptemTranslateController(ttsService, configService) {
		var vm = this;
		configService.set('lang', 'ja-JP');
		configService.set('rate', 0.5);

		vm.speak = function() {
			ttsService.speak(vm.data);
		}
	}
})();