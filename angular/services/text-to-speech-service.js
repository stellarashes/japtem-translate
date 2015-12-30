(function TextToSpeechServiceModule() {
	"use strict";
	
	angular.module('translate.app')
		.factory('ttsService', TextToSpeechService);
	
	TextToSpeechService.$inject = ['configService'];
	
	function TextToSpeechService(configService) {
		return {
			speak: speak
		};

		function speak(phrase) {
			chrome.tts.getVoices(function(voices) {
				console.log(voices);
			});
			chrome.tts.speak(phrase, configService.getAll());
		}
	}
})();