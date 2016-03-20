(function TextToSpeechServiceModule() {
	"use strict";
	
	angular.module('translate.app')
		.factory('ttsService', TextToSpeechService);
	
	TextToSpeechService.$inject = ['configService', '$q'];
	
	function TextToSpeechService(configService, $q) {
		return {
			speak: speak,
			stop: stop,
			getVoices: getVoices
		};

		function speak(phrase) {
			configService.get(['lang', 'rate', 'voiceName']).then(function (options) {
				phrase = phrase.replace(/[…]+/g, '.');
				chrome.tts.speak(phrase, options);
			});
		}

		function stop() {
			chrome.tts.stop();
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