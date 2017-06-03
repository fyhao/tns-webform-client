var util = require('../../../utils/MyUtil');
module.exports = {
	
	renderWidget : function(param, fn) {
		var query = typeof(param.query) != 'undefined' ? param.query : '';
    	util.imgshow().load(query, function(html) {
			fn(html);
		});
	}
}
