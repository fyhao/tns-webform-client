module.exports = {
	
	renderWidget : function(param, fn) {
		var def = typeof(param.def) != 'undefined' ? param.def : '';
    	var html = '<textarea id="' + param.name + '">' + def + '</textarea>';
		fn(html);
	}
	,
	parseValue : function(param, opts, fn) {
		var value = opts.wv.ios.stringByEvaluatingJavaScriptFromString('document.getElementById("' + param.name + '").value');
		fn(value);
	}
}
