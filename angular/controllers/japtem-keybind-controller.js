(function JaptemKeybindControllerModule() {
	"use strict";

	angular.module('translate.app')
		.controller('japtemKeybindController', JaptemKeybindController);

	JaptemKeybindController.$inject = ['keyNameService', 'keyBindService'];

	function JaptemKeybindController(keyNameService, keyBindService) {
		var vm = this;
		
		vm.keyEvent = function (event) {
			event.preventDefault();
			var element = document.activeElement;
			if (element.tagName.toLowerCase() === 'input') {
				var eventName = element.dataset.event;
				var index = element.dataset.index;

				if (event.keyCode !== 27) {// esc
					keyBindService.addKeyBind(event, eventName, index);
				} else {
					keyBindService.removeKeyBind(eventName, index);
				}
			}
		};
		vm.getBinds = keyBindService.listEvents;
		vm.getKeysByEvent = function(eventName) {
			var result = keyBindService.findKeyBindsByEvent(eventName);
			if (!result) {
				return [null, null];
			} else {
				while (result.length < 2) {
					result.push(null);
				}

				return result.map(keyNameService.mapKey);
			}
		}
	}
})();