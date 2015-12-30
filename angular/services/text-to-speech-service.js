(function TextToSpeechServiceModule() {
	"use strict";
	
	angular.module('translate.app')
		.factory('ttsService', TextToSpeechService);
	
	TextToSpeechService.$inject = ['configService', '$q'];
	
	function TextToSpeechService(configService, $q) {
		return {
			speak: speak,
			getVoices: getVoices
		};

		function speak(phrase) {
			configService.getAll().then(function (options) {
				chrome.tts.speak(phrase, options);
			});
		}

		function getVoices() {
			var deferred = $q.defer();
			chrome.tts.getVoices(function(voices) {
				deferred.resolve(voices);
			});

			return deferred.promise;
		}
	}
})();