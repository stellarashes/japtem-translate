(function RawParsingServiceModule() {
	"use strict";

	angular.module('translate.app')
		.factory('rawParsingService', RawParsingService);

	RawParsingService.$inject = [];

	var delimiter = '。';

	function RawParsingService() {
		return {
			parse: function (text) {
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

				var subphrases = paragraph.split(delimiter);
				for (var j = 0; j < subphrases.length; j++) {
					var phrase = subphrases[j];
					if (phrase.trim() === '') {
						continue;
					}
					phrases.push({
						phrase: phrase + delimiter,
						paragraphOffset: i,
						translation: ''
					});
				}
			}

			return phrases;
		}

		function parseFromTranslationAssitant(text) {

		}
	}
})();