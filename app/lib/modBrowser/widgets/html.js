module.exports = {
	
	renderWidget : function(param, fn) {
		var visibility = typeof param.visibility != 'undefined' && !param.visibility ? 'hidden' : 'visible';
		var html = '<div id="' + param.name + '" style="visibility:' + visibility + '">' + param.html + '</div>';
		fn(html);
	}
}
