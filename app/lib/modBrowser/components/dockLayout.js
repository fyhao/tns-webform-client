var DockLayout   = require("ui/layouts/dock-layout").DockLayout  ;
module.exports = {
	
	process : function(c) {
		c.comp = new DockLayout();
	}
}