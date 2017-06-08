module.exports.handleURLScheme = function() {
	var handleOpenURL = require("nativescript-urlhandler").handleOpenURL;

	handleOpenURL(function(appURL) {
		parseAndHandle(appURL);
	});
}

var parseAndHandle = function(url) {
	if(url == null) return;
	if(!url.startsWith("wf://")) {
		return;
	}
	var path = url.substring("wf://".length);
	var arr = path.split('?');
	var action = null;
	if(arr.length > 0) {
		action = arr[0];
	}
	var kv = {};
	if(arr.length > 1) {
		var params = arr[1].split('&');
		for(var i = 0; i < params.length; i++) {
			var p = params[i];
			var pair = p.split('=');
			var k = pair[0];
			var v = pair[1];
			kv[k] = v;
		}
	}
	handle(action, kv);
}
// HANDLING part rules check
var handle = function(action, params) {
	if(action == 'load') {
		if(params.url) {
			loadWebForm(params.url);
		}
	}
}

// ACTUAL HANDLING part
var loadWebForm = function(url) {
	modBrowse.browseURL(url);
}
