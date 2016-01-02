(function RawParsingServiceModule() {
	"use strict";

	angular.module('translate.app')
		.factory('rawParsingService', RawParsingService);

	RawParsingService.$inject = [];

	var delimiter = ['。', '\r', '\n'];

	function RawParsingService() {
		return {
			parse: function (text) {
				var assistantFormat = parseFromTranslationAssitant(text);
				if (assistantFormat) {
					return assistantFormat;
				}
				return parsePlainText(text);
			}
		};

		function parsePlainText(text) {
			var paragraphs = text.trim().split(/[\r?\n]{2}/);
			var phrases = [];
			for (var i = 0; i < paragraphs.length; i++) {
				var paragraph = paragraphs[i].trim();
				if (paragraph === '') {
					continue;
				}

				var subphrases = splitByDelimiter(paragraph, delimiter);
				for (var j = 0; j < subphrases.length; j++) {
					var phrase = subphrases[j].trim();
					if (phrase === '') {
						continue;
					}

					phrases.push({
						phrase: phrase,
						paragraphOffset: i,
						translation: ''
					});
				}
			}

			return phrases;
		}

		/**
		 * Split the haystack without removing the delimiter
		 * @param haystack
		 * @param delimiter
		 */
		function splitByDelimiter(haystack, delimiter) {
			var regex;
			if (Array.isArray(delimiter)) {
				var escaped = delimiter.map(function (element) {
					return element.replace('\\', '\\\\');
				});
				regex = new RegExp('(.*?[' + escaped.join('') + '])', 'g');
			} else {
				regex = new RegExp('(.*?' + delimiter + ')');
			}

			var matches = haystack.match(regex);
			if (!matches) {
				return [haystack];
			}
			return matches;
		}

		function parseFromTranslationAssitant(text) {
			var separator = '---SEPERATOR---';
			var separatorIndex;
			if (text[0] === '%' && (separatorIndex = text.indexOf(separator)) > -1) {
				var raw = text.substr(0, separatorIndex).split(/\r?\n/),
					translated = text.substr(separatorIndex + separator.length).trim().split(/\r?\n/);

				var phrases = [];

				var paragraphIndex = 0;
				for (var i = 0; i < raw.length; i++) {
					if (raw[i][0] === '%') {
						paragraphIndex++;
					}

					var phrase = raw[i].substr(1).trim();
					if (phrase === '') {
						continue;
					}

					phrases.push({
						phrase: phrase,
						paragraphOffset: i,
						translation: (i < translated.length ? translated[i] : '')
					});
				}

				return phrases;
			} else {
				return null;
			}
		}
	}
})();