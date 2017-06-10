module.exports = {
	
	renderWidget : function(param, fn) {
		var visibility = typeof param.visibility != 'undefined' && param.visibility ? 'visible' : 'hidden';
		var html = '<span id="' + param.id + '" style="visibility:' + visibility + '">' + param.name + '</span>';
		fn(html);
	}
}
