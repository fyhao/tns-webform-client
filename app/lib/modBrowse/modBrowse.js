var modBrowser = require('../modBrowser/modBrowser.js'),
exports.getHistory = function(fn) {
    fn(items.slice().reverse());
}

exports.pushHistory = function pushHistory(item, fn) {
    if(items.length >= 5 && items.indexOf(item) == -1) {
        items.splice(0,1);
        items.push(item);
        fn(0);
    }
    else {
        fn(1);
    }
}

exports.clearHistory = function(fn) {
    items = [];
    fn(0);
}

exports.browseURL = function(url) {
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
var items = [
    'http://url1',
    'http://url2',
    'http://url3',
    'http://url4',
    'http://url5'
];