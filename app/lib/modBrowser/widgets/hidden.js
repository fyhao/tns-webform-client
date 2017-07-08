module.exports = {
	
	renderWidget : function(param, fn) {
		var value = typeof(param.value) != 'undefined' ? param.value : '';
		value = typeof(param.def) != 'undefined' ? param.def : value;
    	var html = '<input type="hidden" id="' + param.name + '" value="' + value + '" />';
		fn(html);
	}
	,
	parseValue : function(param, opts, fn) {
		var value = opts.wv.runJS('document.getElementById("' + param.name + '").value');
		fn(value);
	}
}
