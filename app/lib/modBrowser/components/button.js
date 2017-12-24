var buttonModule = require("ui/button");
module.exports = {
	tapable : true,
	process : function(c) {
		c.comp = new buttonModule.Button();
	}
}