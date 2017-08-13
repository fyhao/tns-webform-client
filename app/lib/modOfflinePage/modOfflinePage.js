var setting = require('../../utils/nativeSetting');

function getList() {

	
}

exports.getList = getList;

// for unit test mocking
exports.setSettingController = function(s) {
	setting = s;
}
exports.getSettingController = function() {
	return setting;
}