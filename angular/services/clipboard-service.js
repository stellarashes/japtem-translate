(function ClipboardServiceModule() {
	"use strict";

	angular.module('translate.app')
		.factory('clipboardService', ClipboardService);

	ClipboardService.$inject = [];

	function ClipboardService() {
		return {
			copy: function (text) {
				var input = document.createElement('textarea');
				var firstChild = document.body.firstChild;
				document.body.insertBefore(input, firstChild);
				input.textContent = text;
				input.focus();
				input.select();
				document.execCommand('copy');
				input.remove();
			}
		};
	}
})();