var listViewModule = require("ui/list-view");
module.exports = {
	
	process : function(c) {
		c.comp = new listViewModule.ListView();
		c.comp.src = c.src;
	}
}