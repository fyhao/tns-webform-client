module.exports = {
	
	renderWidget : function(param, fn) {
		var value = typeof(param.value) != 'undefined' ? param.value : '';
		value = typeof(param.def) != 'undefined' ? param.def : value;
		var visibility = typeof param.visibility != 'undefined' && !param.visibility ? 'hidden' : 'visible';
		var html = '<input type="time" id="' + param.name + '" value="' + value + '"  style="visibility:' + visibility + '"/>';
		fn(html);
	}
	,
	parseValue : function(param, opts, fn) {
		var value = opts.wv.runJSSync('document.getElementById("' + param.name + '").value');
		fn(value);
	}
}
