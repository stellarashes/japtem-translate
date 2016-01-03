(function RawRenderingServiceModule() {
	"use strict";
	
	angular.module('translate.app')
		.factory('rawRenderingService', RawRenderingService);
	
	RawRenderingService.$inject = ['configService'];

	var rawDelimiter = '';
	var translatedDelimiter = ' ';
	
	function RawRenderingService(configService) {
		return {
			getPre: function(data, index) {
				return renderSlice(data, 0, index);
			},
			getPost: function(data, index) {
				return renderSlice(data, index + 1);
			},
			getSlice: renderSlice,
			getEntireOutput: function (data) {
				return configService.get('skipRaws')
					.then(function(value) {
						return renderSlice(data, 0, data.length, value);
					});
			}
		};

		function renderSlice(data, start, end, skipRaws) {
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
						paragraphs.push(renderParagraph(build, skipRaws));
					}
					build = [];
					lastParagraphOffset = cur.paragraphOffset;
				}

				build.push(cur);
			}
			if (build.length > 0) {
				paragraphs.push(renderParagraph(build, skipRaws));
			}

			return paragraphs.join('\n\n');
		}

		function renderParagraph(paragraph, skipRaws) {
			var output;
			if (skipRaws) {
				output = '';
			} else {
				output = paragraph.reduce(function(prev, cur) {
					var phrase = prev + rawDelimiter + cur.phrase;
					if (cur.endsWithNewLine) {
						phrase += '\n';
					}
					return phrase;
				}, '').trim();
			}

			var translatedPhrases = paragraph.reduce(function(prev, cur) {
				return prev + cur.translation + (cur.endsWithNewLine ? '\n' : translatedDelimiter);
			}, '').trim();

			if (translatedPhrases !== '') {
				output += (skipRaws ? '' : '\n') + translatedPhrases;
			}

			return output;
		}
	}
})();