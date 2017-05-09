var helpers = require('../../utils/widgets/helper');
module.exports.createBrowser = function() {
	return new Browser();
}

function Browser() {
	this.open = function(url) {
		helpers.navigate({
			moduleName : 'components/browserView/browserView',
			context : {url:url}
		});
	}
}