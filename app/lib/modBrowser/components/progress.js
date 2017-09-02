var Progress = require("ui/progress").Progress;
module.exports = {
	process : function(c) {
		c.comp = new Progress();
	}
}