module.exports = {
	
	renderWidget : function(param, fn) {
		param.options = parseParamOptions(param.options);
		var html = '<select id="' + param.name + '">';
		for(var j = 0; j < param.options.length; j++) {
			var key = param.options[j]['key'];
			var val = param.options[j]['value'];
			var selected = param.def && param.def == val;
			var selectedStr = selected ? ' selected' : '';
			html += '<option value="' + val + '" ' + selectedStr + '>' + key + '</option>';
		}
		html += '</select>';
		fn(html);
	}
	,
	parseValue : function(param, opts, fn) {
		var value = opts.wv.ios.stringByEvaluatingJavaScriptFromString('document.getElementById("' + param.name + '").selectedOptions[0].value');
		fn(value);
	}
}

var parseParamOptions = function(options) {
	if(!options.length) {
		// object, not array
		var temp = [];
		for(var k in options) {
			var v = options[k];
			temp.push({value:k,key:v});
		}
		options = temp;
		temp = null;
	}
	else {
		// is array
		var temp = [];
		for(var k in options) {
			var v = options[k];
			if(typeof v != 'object') {
				temp.push({value:v,key:v});
			}
			else {
				return options;
			}
		}
		options = temp;
		temp = null;
	}
	return options;
}
