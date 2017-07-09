var appSettings = require("application-settings");
module.exports = {
	setString : function(name, value) {
		appSettings.setString(name, value);
	},
	getString : function(name, value) {
		return appSettings.getString(name, value);
	}
}