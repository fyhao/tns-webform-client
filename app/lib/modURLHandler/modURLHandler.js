var modBrowse = require('../modBrowse/modBrowse.js');
var logs = [];
module.exports.handleURLScheme = function() {
	var handleOpenURL = require("nativescript-urlhandler").handleOpenURL;
	try {
		logs.push('1');
		handleOpenURL(function(appURL) {
			logs.push('2');
			parseAndHandle(appURL);
		});
	} catch (e) {
		alert(e + " - " + JSON.stringify(logs));
	}
}

var parseAndHandle = function(url) {
	if(url == null) return;
	if(!url.startsWith("wf://")) {
		return;
	}
	logs.push('2.1:' + url);
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
	logs.push('2.2:' + action + ',' + JSON.stringify(kv));
	handle(action, kv);
}
// HANDLING part rules check
var handle = function(action, params) {
	logs.push('2.3:' + action);
	if(action == 'load') {
		logs.push('2.4:' + params.url);
		if(params.url) {
			logs.push('2.5');
			loadWebForm(params.url);
		}
	}
}

// ACTUAL HANDLING part
var loadWebForm = function(url) {
	logs.push('2.6');
	modBrowse.browseURL(url);
	logs.push('2.7');
}
