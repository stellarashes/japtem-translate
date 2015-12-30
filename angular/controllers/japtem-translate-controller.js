(function JaptemTranslateControllerModule() {
	"use strict";

	angular.module('translate.app')
		.controller('japtemTranslateController', JaptemTranslateController);

	JaptemTranslateController.$inject = ['ttsService', 'configService', 'fileSystemService'];

	function JaptemTranslateController(ttsService, configService, fileSystemService) {
		var vm = this;

		vm.speak = function() {
			ttsService.speak(vm.data);
		};

		vm.stop = ttsService.stop;
	}
})();