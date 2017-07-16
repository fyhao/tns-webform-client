var modBrowser = require('../modBrowser/modBrowser.js');
var setting = require('../../utils/nativeSetting');
//CONSTANT
var HISTORY_SETTING_NAME = "history";

function pushHistory(item, fn) {
	getHistory(function(items) {
		while(items.length >= 5) {
			items = items.splice(0,1);
		}
		if(items.indexOf(items) == -1) {
			items.push(item);
		}
		saveHistory(items, function(code) {
			fn(code);
		});
	});
    
}

function clearHistory(fn) {
	// db
    items = [];
	saveHistory(items, function(code) {
		fn(code);
	});
}

function getHistory(fn) {
	// db
	var str = setting.getString(HISTORY_SETTING_NAME, '[]');
	var items = JSON.parse(str);
    fn(items.slice().reverse());
}

function saveHistory(items, fn) {
	// db
	setting.setString(HISTORY_SETTING_NAME, JSON.stringify(items));
	fn(0);
}

function browseURL(url) {
	// Check URL
	if(!url.startsWith("http")) {
		alert('Invalid URL format: ' + url);
		return;
	}
	// Browse URL
	pushHistory(url, function(status) {
		var browser = modBrowser.createBrowser();
		browser.open(url);
	});
}

exports.getHistory = getHistory;

exports.pushHistory = pushHistory;

exports.clearHistory = clearHistory;

exports.browseURL = browseURL;


// for unit test mocking
exports.setSettingController = function(s) {
	setting = s;
}
exports.getSettingController = function() {
	return setting;
}

