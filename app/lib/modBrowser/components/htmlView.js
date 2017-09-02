var HtmlView = require("ui/html-view").HtmlView;
module.exports = {
	
	process : function(c) {
		c.comp = new HtmlView();
	}
}