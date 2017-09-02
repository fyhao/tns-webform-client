var ActivityIndicator = require("ui/activity-indicator").ActivityIndicator;
module.exports = {
	process : function(c) {
		c.comp = new ActivityIndicator();
	}
}