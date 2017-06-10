module.exports = {
	
	renderWidget : function(param, fn) {
		var def = typeof(param.def) != 'undefined' ? param.def : '';
		var html = '<input type="text" id="' + param.name + '" value="' + def + '" placeholder="' + param.name + '" cols="100" />';
		fn(html);
	}
	,
	parseValue : function(param, opts, fn) {
		var value = opts.wv.ios.stringByEvaluatingJavaScriptFromString('document.getElementById("' + param.name + '").value');
		fn(value);
	}
}
