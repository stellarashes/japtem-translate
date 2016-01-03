chrome.app.runtime.onLaunched.addListener(function() {
	chrome.storage.local.get('config', function (result) {
		var config = result.config;
		chrome.app.window.create('main.html', {
			bounds: {
				width: 450,
				height: 800
			},
			alwaysOnTop: config ? config.alwaysOnTop : false
		});
	});

});