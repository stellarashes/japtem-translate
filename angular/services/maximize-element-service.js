(function MaximizeElementServiceModule() {
	"use strict";

	angular.module('translate.app')
		.factory('maximizeElementService', MaximizeElementService);

	MaximizeElementService.$inject = [];

	function MaximizeElementService() {
		return {
			maximize: function ($window, element, parentElement, siblings, borderSize) {
				var window = angular.element($window);

				function resize() {
					var parentHeight = getElement(parentElement).clientHeight;
					var siblingHeight = getElementHeight(siblings);
					setElementHeight(element, parentHeight - siblingHeight, borderSize);
				}

				window.bind('resize', resize);
				resize();
			}
		};

		function getElement(element) {
			if (typeof(element) === 'string') {
				return document.querySelector(element);
			} else {
				return element;
			}
		}

		function getElementHeight(element) {
			if (Array.isArray(element)) {
				var total = 0;
				for (var i = 0; i < element.length; i++) {
					var elementHeight = getElement(element[i]).offsetHeight;
					console.log(element, elementHeight);
					total += elementHeight;
				}

				return total;
			} else {
				return getElement(element).offsetHeight;
			}
		}

		function setElementHeight(element, maxHeight, borderSize) {
			if (Array.isArray(element)) {
				var count = element.length;
				var height = maxHeight / count - borderSize;
				for (var i = 0; i < element.length; i++) {
					getElement(element[i]).style.height = height + 'px';
				}
			} else {
				getElement(element).style.height =  (maxHeight - borderSize) + 'px';
			}
		}
	}
})();