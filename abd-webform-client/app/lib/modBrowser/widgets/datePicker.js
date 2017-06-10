module.exports = {
	
	renderWidget : function(param, fn) {
		var value = typeof(param.value) != 'undefined' ? param.value : '';
		value = typeof(param.def) != 'undefined' ? param.def : value;
		var visibility = typeof param.visibility != 'undefined' && param.visibility ? 'visible' : 'hidden';
		var html = '<input type="date" name="' + param.name + '" value="' + value + '" />';
		fn(html);
	}
	,
	parseValue : function(param, opts, fn) {
		var value = opts.wv.ios.stringByEvaluatingJavaScriptFromString('document.getElementById("' + param.name + '").value');
		fn(value);
	}
}
