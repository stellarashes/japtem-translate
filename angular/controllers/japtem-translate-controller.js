(function JaptemTranslateControllerModule() {
	"use strict";

	angular.module('translate.app')
		.controller('japtemTranslateController', JaptemTranslateController);

	JaptemTranslateController.$inject = ['ttsService', 'configService'];

	function JaptemTranslateController(ttsService, configService) {
		var vm = this;

		vm.speak = function() {
			ttsService.speak(vm.data);
		}
	}
})();