(function JaptemTranslateControllerModule() {
	"use strict";

	angular.module('translate.app')
		.controller('japtemTranslateController', JaptemTranslateController);

	JaptemTranslateController.$inject = ['ttsService', 'storageService', 'rawParsingService', 'rawRenderingService', 'phraseMappingService', 'clipboardService', '$timeout', 'maximizeElementService', '$window', 'saveLoadService', 'keyBindService', '$scope'];

	function JaptemTranslateController(ttsService, storageService, rawParsingService, rawRenderingService, phraseMappingService, clipboardService, $timeout, maximizeElementService, $window, saveLoadService, keyBindService, $scope) {
		var vm = this;

		init();

		vm.lastSaved = Date.now();

		vm.speak = function () {
			ttsService.speak(vm.currentRaw());
		};

		vm.stop = ttsService.stop;

		vm.newProject = openModal;

		function onNewProject(data) {
			vm.data = rawParsingService.parse(data);
			vm.cursor = 0;
			update();
			vm.save();
		}

		vm.create = function () {
			onNewProject(vm.newData);
			closeModal();
		};

		vm.saveToFile = function () {
			vm.save();
			return saveLoadService.save(vm.data);
		};

		vm.save = function () {
			vm.lastSaved = Date.now();
			saveCurrentTranslation();
			storageService.set({
				working: vm.data,
				cursor: vm.cursor
			});
		};

		vm.cancelCreate = closeModal;

		function init() {
			maximizeElementService.maximize($window, ['.pre-text', '.post-text'], '.japtem-translate-container', '.translation-texts-cursor-container', 50);

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

		function openModal() {
			document.querySelector('#japtem-new-modal-container').showModal();
		}

		function closeModal() {
			document.querySelector('#japtem-new-modal-container').close();
		}

		vm.pre = function () {
			return rawRenderingService.getPre(vm.data, vm.cursor);
		};

		vm.post = function () {
			return rawRenderingService.getPost(vm.data, vm.cursor);
		};

		vm.currentRaw = function () {
			return getPhrase().phrase;
		};

		function getCurrentMappedRaw() {
			return phraseMappingService.mapPhrase(vm.currentRaw())
				.then(function (result) {
					vm.currentMappedRaw = result;
					clipboardService.copy(vm.currentMappedRaw);
					focusInput();
				});
		}

		function focusInput() {
			document.querySelector('#current-row-translation').focus();
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

		vm.currentKeyListener = function (event) {
			keyBindService.triggerByKey(event);
		};

		vm.changeLineEvent = function (eventName, event) {
			event.preventDefault();
			saveCurrentTranslation();

			var delta = eventName === 'prevLine' ? -1 : 1;
			var target = vm.cursor + delta;
			vm.cursor = ensureTargetRange(target);
			update();
			autosave();
		};

		vm.goToUntranslated = function() {
			for (var i = 0; i < vm.data.length; i++) {
				if (vm.data[i].translation === '') {
					vm.cursor = i;
					update();
					autosave();
					return;
				}
			}
			vm.cursor = vm.data.length - 1;
			update();
			autosave();
		};

		keyBindService.addKeyListener('prevLine', 'Previous Line', $scope, vm.changeLineEvent);
		keyBindService.addKeyListener('nextLine', 'Next Line', $scope, vm.changeLineEvent);
		keyBindService.addKeyListener('startTTS', 'Start TTS', $scope, vm.speak);
		keyBindService.addKeyListener('stopTTS', 'Stop TTS', $scope, vm.stop);
		keyBindService.addKeyListener('gotoUntrans', 'Next Untranslated', $scope, vm.goToUntranslated);


		vm.openFile = function () {
			saveLoadService.load()
				.then(onNewProject);
		};

		function update() {
			vm.currentTranslation = getPhrase().translation;
			getCurrentMappedRaw();
			var element = document.querySelector('.pre-text');
			if (element) {
				$timeout(function () {
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

		function autosave() {
			vm.save();
		}

		vm.copyToClipboard = function () {
			return rawRenderingService.getEntireOutput(vm.data)
				.then(function (output) {
					clipboardService.copy(output);
				});
		}

	}
})();