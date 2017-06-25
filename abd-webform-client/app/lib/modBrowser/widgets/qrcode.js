var util = require('../../../utils/MyUtil');
module.exports = {
	
	renderWidget : function(param, fn) {
		var visibility = typeof param.visibility != 'undefined' && !param.visibility ? 'hidden' : 'visible';
		fn('<div id="' + param.id + '" style="visibility:' + visibility + '"></div>');
	}
	,
	init : function(param, opts) {
		var query = 'q:name=qrcode,width=' + param.width + ',height=' + param.height + ',text=' + encodeURIComponent(param.text);
    	util.imgshow().load(query, function(html) {
			opts.wv.ios.stringByEvaluatingJavaScriptFromString("document.getElementById('" + param.id + "').innerHTML = '" + html + "'");
		});
	}
}
