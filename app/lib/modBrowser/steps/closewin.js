var helpers = require('../../../utils/widgets/helper');
module.exports = {
	
	process : function(ctx, step, next) {
		helpers.back();
		setTimeout(next, 1);
	}
}