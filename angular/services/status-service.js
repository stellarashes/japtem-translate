(function StatusServiceModule() {
	"use strict";

	angular.module('translate.app')
		.factory('statusService', StatusService);

	StatusService.$inject = [];

	function StatusService() {
		return {
			getStatusLine: function (data) {
				var count = getLineCounts(data);
				count.percentage = count.line > 0 ? Math.round(count.completed / count.line * 100.) : 0;
				return {
					count: count
				};
			}
		};
	}

	function getLineCounts(data) {
		var count = {
			line: 0,
			completed: 0,
			words: 0
		};

		for (var i = 0; i < data.length; i++) {
			var line = data[i];
			if (shouldIncrement(data, line, i)) {
				increment(line, count);
			}

			if (line.translation) {
				count.words += line.translation.split(/[ ]+/).length;
			}
		}

		return count;
	}

	function shouldIncrement(data, line, index) {
		if (index >= data.length - 1) {
			return true;
		} else if (line.endsWithNewLine) {
			return true;
		} else if (line.paragraphOffset !== data[index + 1].paragraphOffset) {
			return true;
		}

		return false;
	}

	function increment(line, count) {
		++count.line;
		if (line.translation) {
			++count.completed;
		}
	}
})();