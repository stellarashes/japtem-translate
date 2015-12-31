(function JaptemTranslateControllerModule() {
	"use strict";

	angular.module('translate.app')
		.controller('japtemTranslateController', JaptemTranslateController);

	JaptemTranslateController.$inject = ['ttsService', 'storageService', 'rawParsingService', 'rawRenderingService', 'phraseMappingService', 'clipboardService', '$timeout'];

	var scrollUp = 38, scrollDown = 40;

	function JaptemTranslateController(ttsService, storageService, rawParsingService, rawRenderingService, phraseMappingService, clipboardService, $timeout) {
		var vm = this;

		init();

		vm.lastSaved = Date.now();

		vm.speak = function() {
			ttsService.speak(vm.currentRaw());
		};

		vm.stop = ttsService.stop;

		vm.newProject = openModal;

		vm.create = function() {
			vm.data = rawParsingService.parse(vm.newData);
			vm.cursor = 0;
			update();
			vm.save();
			closeModal();
		};

		vm.save = function() {
			vm.lastSaved = Date.now();
			saveCurrentTranslation();
			storageService.set({
				working: vm.data,
				cursor: vm.cursor
			});
		};

		vm.cancelCreate = closeModal;

		function openModal() {
			document.querySelector('#japtem-new-modal-container').showModal();
		}

		function closeModal() {
			document.querySelector('#japtem-new-modal-container').close();
		}

		vm.pre = function() {
			return rawRenderingService.getPre(vm.data, vm.cursor);
		};

		vm.post = function() {
			return rawRenderingService.getPost(vm.data, vm.cursor);
		};

		vm.currentRaw = function() {
			return getPhrase().phrase;
		};

		function getCurrentMappedRaw() {
			return phraseMappingService.mapPhrase(vm.currentRaw())
				.then(function (result) {
					vm.currentMappedRaw = result;
				});
		}

		function getPhrase() {
			var phrase;
			if (!vm.data || !(phrase = vm.data[vm.cursor])) {
				return {
					phrase: '',
					translation: ''
				};
			} else {
				return phrase;
			}
		}

		vm.currentKeyListener = function(event) {
			if (event.keyCode === scrollUp || event.keyCode === scrollDown) {
				event.preventDefault();
				saveCurrentTranslation();

				if (shouldAutoSaveAgain()) {
					vm.save();
				}

				var delta = event.keyCode === scrollUp ? -1 : 1;
				var target = vm.cursor + delta;
				vm.cursor = ensureTargetRange(target);
				update();
			}
		};

		function update() {
			vm.currentTranslation = getPhrase().translation;
			getCurrentMappedRaw();
			var element = document.querySelector('.pre-text');
			if (element) {
				$timeout(function() {
					element.scrollTop = element.scrollHeight;
				});
			}
		}

		function ensureTargetRange(target) {
			target = Math.max(0, target);
			target = Math.min(target, vm.data ? vm.data.length : 0);

			return target;
		}

		function saveCurrentTranslation() {
			if (vm.currentTranslation) {
				getPhrase().translation = vm.currentTranslation;
			}
		}

		function init() {
			storageService.get(['working', 'cursor'])
				.then(function (data) {
					var workingSet = data.working;
					if (workingSet && Array.isArray(workingSet)) {
						vm.data = workingSet;
						vm.cursor = data.cursor;

						update();
					}
				});
		}

		function shouldAutoSaveAgain() {
			return true;
		}

		vm.copyToClipboard = function() {
			var data = rawRenderingService.getSlice(vm.data, 0);
			clipboardService.copy(data);
		}

	}
})();