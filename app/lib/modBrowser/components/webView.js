var webViewModule = require("ui/web-view");
module.exports = {
	
	process : function(c) {
		c.comp = new webViewModule.WebView();
		c.comp.src = c.src;
	}
}