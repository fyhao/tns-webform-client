module.exports = {
	
	renderWidget : function(param, fn) {
		var value = typeof(param.value) != 'undefined' ? param.value : '';
		value = typeof(param.def) != 'undefined' ? param.def : value;
		var visibility = typeof param.visibility != 'undefined' && !param.visibility ? 'hidden' : 'visible';
		var html = '<input type="text" id="' + param.name + '" value="' + value + '" placeholder="' + param.name + '" cols="100" style="visibility:' + visibility + '" onfocus="this.oldvalue = this.value;"/>';
		fn(html);
	}
	,
	parseValue : function(param, opts, fn) {
		var value = opts.wv.runJS('document.getElementById("' + param.name + '").value');
		fn(value);
	}
}
