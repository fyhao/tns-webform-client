var util = require('../../../utils/MyUtil');
module.exports = {
	
	renderWidget : function(param, fn) {
		var visibility = typeof param.visibility != 'undefined' && param.visibility ? 'visible' : 'hidden';
		fn('<div id="' + param.id + '" style="visibility:' + visibility + '"></div>');
	}
	,
	init : function(param, opts) {
		var query = typeof(param.query) != 'undefined' ? param.query : '';
    	util.imgshow().load(query, function(html) {
			opts.wv.ios.stringByEvaluatingJavaScriptFromString("document.getElementById('" + param.id + "').innerHTML = '" + html + "'");
		});
	}
}
