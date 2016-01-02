(function RawRenderingServiceModule() {
	"use strict";
	
	angular.module('translate.app')
		.factory('rawRenderingService', RawRenderingService);
	
	RawRenderingService.$inject = [];

	var rawDelimiter = '';
	var translatedDelimiter = ' ';
	
	function RawRenderingService() {
		return {
			getPre: function(data, index) {
				return renderSlice(data, 0, index);
			},
			getPost: function(data, index) {
				return renderSlice(data, index + 1);
			},
			getSlice: renderSlice
		};

		function renderSlice(data, start, end) {
			if (!data) {
				return '';
			}
			var slice = data.slice(start, end);
			var lastParagraphOffset = -1;
			var build = [];
			var paragraphs = [];

			for (var i = 0; i < slice.length; i++) {
				var cur = slice[i];
				if (cur.paragraphOffset !== lastParagraphOffset) {
					if (lastParagraphOffset > -1) {
						paragraphs.push(renderParagraph(build));
					}
					build = [];
					lastParagraphOffset = cur.paragraphOffset;
				}

				build.push(cur);
			}
			if (build.length > 0) {
				paragraphs.push(renderParagraph(build));
			}

			return paragraphs.join('\n\n');
		}

		function renderParagraph(paragraph) {
			var output = paragraph.reduce(function(prev, cur) {
				var phrase = prev + rawDelimiter + cur.phrase;
				if (cur.endsWithNewLine) {
					phrase += '\n';
				}
				return phrase;
			}, '');
			var translatedPhrases = paragraph.reduce(function(prev, cur) {
				return prev + translatedDelimiter + cur.translation;
			}, '').trim();

			if (translatedPhrases !== '') {
				output += '\n' + translatedPhrases;
			}

			return output;
		}
	}
})();