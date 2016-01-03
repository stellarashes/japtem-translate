(function KeyBindServiceModule() {
	"use strict";

	angular.module('translate.app')
		.factory('keyBindService', KeyBindService);

	KeyBindService.$inject = ['keyNameService', 'configService'];

	var eventCallbacks = {}, eventBinds = {}, keyMappings = {}, displayNames = {};

	function KeyBindService(keyNameService, configService) {
		configService.get('keybinds')
			.then(function (result) {
				eventBinds = result || {
						prevLine: [getSimpleKey(33)],
						nextLine: [getSimpleKey(34), getSimpleKey(13)]
					};
				buildKeyMapping();
			});

		return {
			/**
			 * Add a listener for events; the callback will be called with parameters (eventName, KeyboardEvent)
			 * @param eventName
			 * @param displayName
			 * @param $scope controller scope
			 * @param callback
			 */
			addKeyListener: function (eventName, displayName, $scope, callback) {
				if (eventCallbacks.hasOwnProperty(eventName)) {
					eventCallbacks[eventName].push(callback);
				} else {
					eventCallbacks[eventName] = [callback];
				}
				displayNames[eventName] = displayName;
				$scope.$on('$destroy', function() {
					this.removeListener(eventName, callback);
				}.bind(this));
			},

			removeListener: function (eventName, callback) {
				if (eventCallbacks.hasOwnProperty(eventName)) {
					var index = eventCallbacks[eventName].indexOf(callback);
					if (index > -1) {
						eventCallbacks[eventName].splice(index, 1);
					}
				}
			},

			listEvents: function () {
				return displayNames;
			},

			addKeyBind: function (keyEvent, eventName, index) {
				var key = getKeyObjectFromEvent(keyEvent);
				if (!eventBinds.hasOwnProperty(eventName)) {
					eventBinds[eventName] = [];
					eventBinds[eventName][index] = key;
				} else {
					eventBinds[eventName][index] = key;
				}
				configService.set('keybinds', eventBinds);
				buildKeyMapping();
			},

			removeKeyBind: function (eventName, index) {
				if (eventBinds.hasOwnProperty(eventName)) {
					var eventBind = eventBinds[eventName];
					eventBind.splice(index, 1);
					configService.set('keybinds', eventBinds);
					buildKeyMapping();
				}
			},

			getEventByKey: function (keyEvent) {
				return keyMappings[keyNameService.mapKey(keyEvent)];
			},

			triggerByKey: function (keyEvent) {
				var triggeredEvents = this.getEventByKey(keyEvent);
				if (triggeredEvents) {
					for (var i in triggeredEvents) {
						var event = triggeredEvents[i];
						if (eventCallbacks.hasOwnProperty(event)) {
							var callbacks = eventCallbacks[event];
							for (var j in callbacks) {
								callbacks[j].call(null, event, keyEvent);
							}
						}
					}
				}
			},

			findKeyBindsByEvent: function (eventName) {
				return eventBinds[eventName];
			}
		};

		function buildKeyMapping() {
			keyMappings = {};
			for (var eventName in eventBinds) {
				var keysBound = eventBinds[eventName];
				for (var i in keysBound) {
					var key = keysBound[i];
					if (!key) {
						continue;
					}
					var keyName = keyNameService.mapKey(key);
					if (keyMappings.hasOwnProperty(keyName)) {
						keyMappings[keyName].push(eventName);
					} else {
						keyMappings[keyName] = [eventName];
					}
				}
			}
		}

		function equals(key1, key2) {
			return key1.ctrlKey === key2.ctrlKey && key1.altKey === key2.altKey && key1.shiftKey === key2.shiftKey && key1.keyCode === key2.keyCode;
		}

		function getKeyObjectFromEvent(event) {
			return _.pick(event, ['ctrlKey', 'altKey', 'shiftKey', 'keyCode']);
		}

		function getSimpleKey(keyCode) {
			return {
				ctrlKey: false,
				altKey: false,
				shiftKey: false,
				keyCode: keyCode
			};
		}
	}
})();