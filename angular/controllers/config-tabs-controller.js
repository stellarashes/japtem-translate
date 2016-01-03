(function ConfigTabsControllerModule() {
	"use strict";

	angular.module('translate.app')
		.controller('configTabsController', ConfigTabsController);

	ConfigTabsController.$inject = [];

	function ConfigTabsController() {
		var vm = this;
		
		vm.tab = 1;
		vm.setTab = function (val) {
			vm.tab = val;
		}
	}
})();