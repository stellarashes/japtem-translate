(function ClipboardServiceModule() {
	"use strict";

	angular.module('translate.app')
		.factory('clipboardService', ClipboardService);

	ClipboardService.$inject = [];

	function ClipboardService() {
		return {
			copy: function (text) {
				var input = document.createElement('textarea');
				var container = document.querySelector('japtem-translate');
				document.body.insertBefore(input, container);
				input.textContent = text;
				input.focus();
				input.select();
				document.execCommand('copy');
				input.remove();
			}
		};
	}
})();