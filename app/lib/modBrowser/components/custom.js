module.exports = {
	
	process : function(c) {
		var val = new Function('c', 'c; ' + c.code);
		val(c);
		// require to set c.comp inside our custom code
	}
}