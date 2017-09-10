var scrollViewModule = require("ui/scroll-view");
module.exports = {
	
	process : function(c) {
		c.comp = new scrollViewModule.scrollView();
	}
}