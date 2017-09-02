var TimePicker  = require("ui/time-picker").TimePicker ;
module.exports = {
	process : function(c) {
		c.comp = new TimePicker();
		
	}
}