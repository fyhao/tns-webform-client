var setting = require('../../utils/nativeSetting');

function getList(fn) {

	
}

function addPage(item, fn) {
	
}

exports.getList = getList;
exports.addPage = addPage;

// for unit test mocking
exports.setSettingController = function(s) {
	setting = s;
}
exports.getSettingController = function() {
	return setting;
}