module.exports = {
	
	renderWidget : function(param, fn) {
		var html = '<div id="' + param.name + '">' + param.html + '</div>';
		fn(html);
	}
}
