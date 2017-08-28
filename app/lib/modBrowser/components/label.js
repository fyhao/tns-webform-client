var labelModule = require("ui/label");
module.exports = {
	
	process : function(c) {
		c.comp = new labelModule.Label();
		c.comp.text = c.text;
	}
}