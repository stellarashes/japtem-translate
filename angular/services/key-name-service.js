(function KeyNameServiceModule() {
	"use strict";

	angular.module('translate.app')
		.factory('keyNameService', KeyNameService);

	KeyNameService.$inject = [];

	function KeyNameService() {
		return {
			mapKey: function (event) {
				if (event === null) {
					return '';
				}
				var keys = getMetaKeys(event);

				if (!isMetaKey(event.keyCode)) {
					keys.push(names[event.keyCode]);
				}

				return keys.join(' + ');
			}
		};
	}

	function isMetaKey(keyCode) {
		return keyCode === 17 || keyCode === 18 || keyCode === 16;
	}

	function getMetaKeys(event) {
		var output = [];
		if (event.ctrlKey) {
			output.push('ctrl');
		}

		if (event.altKey) {
			output.push('alt');
		}

		if (event.shiftKey) {
			output.push('shift');
		}

		return output;
	}

	// mapping taken from https://github.com/timoxley/keycode
	var codes = {
		'backspace': 8,
		'tab': 9,
		'enter': 13,
		'shift': 16,
		'ctrl': 17,
		'alt': 18,
		'pause/break': 19,
		'caps lock': 20,
		'esc': 27,
		'space': 32,
		'page up': 33,
		'page down': 34,
		'end': 35,
		'home': 36,
		'left arrow': 37,
		'up arrow': 38,
		'right arrow': 39,
		'down arrow': 40,
		'insert': 45,
		'delete': 46,
		'command': 91,
		'right click': 93,
		'numpad *': 106,
		'numpad +': 107,
		'numpad -': 109,
		'numpad .': 110,
		'numpad /': 111,
		'num lock': 144,
		'scroll lock': 145,
		'my computer': 182,
		'my calculator': 183,
		';': 186,
		'=': 187,
		',': 188,
		'-': 189,
		'.': 190,
		'/': 191,
		'`': 192,
		'[': 219,
		'\\': 220,
		']': 221,
		"'": 222
	};

// Helper aliases

	var aliases = {
		'windows': 91,
		'⇧': 16,
		'⌥': 18,
		'⌃': 17,
		'⌘': 91,
		'ctl': 17,
		'control': 17,
		'option': 18,
		'pause': 19,
		'break': 19,
		'caps': 20,
		'return': 13,
		'escape': 27,
		'spc': 32,
		'pgup': 33,
		'pgdn': 33,
		'ins': 45,
		'del': 46,
		'cmd': 91
	};


	/*!
	 * Programatically add the following
	 */

// lower case chars
	for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32

// numbers
	for (var i = 48; i < 58; i++) codes[i - 48] = i

// function keys
	for (i = 1; i < 13; i++) codes['f' + i] = i + 111

// numpad keys
	for (i = 0; i < 10; i++) codes['numpad ' + i] = i + 96

	/**
	 * Get by code
	 *
	 *   exports.name[13] // => 'Enter'
	 */

	var names = {}; // title for backward compat

// Create reverse mapping
	for (i in codes) names[codes[i]] = i

// Add aliases
	for (var alias in aliases) {
		codes[alias] = aliases[alias]
	}
})();