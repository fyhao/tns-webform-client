module.exports = {
	
	renderWidget : function(param, fn) {
		var html = '<span id="' + param.id + '">' + param.name + '</span>';
		fn(html);
	}
}
