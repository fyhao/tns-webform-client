var setting = null;

function initSetting() {
	if(setting == null) setting = require('../../utils/nativeSetting');
	return setting;
}

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
	getAvailableTitle(function(title) {
		var pageItem = {};
		pageItem.title = title;
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
	});
	
}


function getAvailableTitle(fn) {
	var c = 0;
	var _find = function(a) {
		var t = 'Untitled';
		if(a > 0) {
			t += a;
		}
		findByTitle(t, function(item) {
			if(item == null) {
				fn(t);
			}
			else {
				c++;
				_find(c);
			}
		});
	}
	_find(c);
	
}
function findById(id, fn) {
	findBy('id',id, fn);
}
function findByTitle(title, fn) {
	findBy('title',title, fn);
}
function updateById(id, item, fn) {
	findByAndSave('id', id, 'save', function(oldItem) {
		for(var key in item) {
			oldItem[key] = item[key];
		}
	},fn);
}
function deleteById(id, fn) {
	findByAndSave('id', id, 'delete', null,fn);
}

function findBy(key,value,fn) {
	findByAndSave(key,value,'',fn);
}
function findByAndSave(key,value,oper,fn,savefn) {
	if(!fn) fn = function(a) {}
	getDB(function(items) {
		for(var i = 0; i < items.length; i++) {
			if(items[i][key] == value) {
				fn(items[i]);
				if(oper == 'save') {
					saveDB(items, savefn);
				}
				if(oper == 'delete') {
					items.splice(i,1);
					saveDB(items, savefn);
				}
				return;
			}
		}
		if(oper == 'delete') {
			savefn(1);
		}
		else {
			fn(null);
		}
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
	initSetting();
	var str = setting.getString(DB_SETTING_NAME, '[]');
	var items = JSON.parse(str);
    fn(items.slice().reverse());
}

function saveDB(items, fn) {
	// db
	initSetting();
	setting.setString(DB_SETTING_NAME, JSON.stringify(items));
	if(typeof fn != 'undefined') fn(0);
}
var DB_SETTING_NAME = "OfflinePageDB";

exports.getList = getList;
exports.addPage = addPage;
exports.addPageInCategory = addPageInCategory;
exports.findById = findById;
exports.findBy = findBy;
exports.findByTitle = findByTitle;
exports.updateById = updateById;
exports.deleteById = deleteById;
exports.findByAndSave = findByAndSave;
exports.clearDB = clearDB;

// for unit test mocking
exports.setSettingController = function(_s) {
	setting = _s;
}
exports.getSettingController = function() {
	return setting;
}