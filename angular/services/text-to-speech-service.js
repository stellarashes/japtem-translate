(function TextToSpeechServiceModule() {
	"use strict";
	
	angular.module('translate.app')
		.factory('ttsService', TextToSpeechService);
	
	TextToSpeechService.$inject = ['configService', '$q'];

	var delimiters = /[、。…？！]/;
	
	function TextToSpeechService(configService, $q) {
		return {
			speak: speak,
			stop: stop,
			getVoices: getVoices
		};

		function speak(phrase) {
			configService.get(['lang', 'rate', 'voiceName']).then(function (options) {
				phrase = phrase.replace(/[…]+/g, '.');
				speakRaw(phrase, options);
			});
		}

		function speakRaw(phrase, options) {
			if (phrase.length > 60) {
				var utterances = phrase.split(delimiters);
				chrome.tts.speak(utterances[0], options);
				options.enqueue = true;
				for (var i = 1; i < utterances.length; i++) {
					var obj = utterances[i];
					chrome.tts.speak(obj, options);
				}
			} else {
				chrome.tts.speak(phrase, options);
			}
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