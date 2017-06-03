var util = require('../../../utils/MyUtil');
module.exports = {
	
	renderWidget : function(param, fn) {
		var query = 'q:name=qrcode,width=' + param.width + ',height=' + param.height + ',text=' + encodeURIComponent(param.text);
    	util.imgshow().load(query, function(html) {
			fn(html);
		});
	}
}
