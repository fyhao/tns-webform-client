var setting = require('../../utils/nativeSetting');

function getList(fn) {
	getDB(function(items) {
		fn(items);
	});
}

function addPage(item, fn) {
	var pageItem = {};
	pageItem.title = 'Untitled';
	pageItem.type = 'item';
	pageItem.createdTime = new Date();
	pageItem.item = item;
	getDB(function(items) {
		items.push(pageItem);
		saveDB(items, function(status) {
			fn(status);
		});
	});
}

function addPageInCategory(cat, url, fn) {
	var pageItem = {};
	pageItem.title = 'Untitled';
	pageItem.type = 'category';
	pageItem.sourceURL = url;
	pageItem.createdTime = new Date();
	pageItem.cat = cat;
	pageItem.id = 'id' + new Date().getTime();
	getDB(function(items) {
		items.push(pageItem);
		saveDB(items, function(status) {
			fn(status);
		});
	});
}


function clearDB(fn) {
	// db
    items = [];
	saveDB(items, function(code) {
		fn(code);
	});
}

function getDB(fn) {
	// db
	var str = setting.getString(DB_SETTING_NAME, '[]');
	var items = JSON.parse(str);
    fn(items.slice().reverse());
}

function saveDB(items, fn) {
	// db
	setting.setString(DB_SETTING_NAME, JSON.stringify(items));
	fn(0);
}
var DB_SETTING_NAME = "OfflinePageDB";

exports.getList = getList;
exports.addPage = addPage;
exports.addPageInCategory = addPageInCategory;

// for unit test mocking
exports.setSettingController = function(s) {
	setting = s;
}
exports.getSettingController = function() {
	return setting;
}