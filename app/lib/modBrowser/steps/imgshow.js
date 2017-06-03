var util = require('../../../utils/MyUtil');
module.exports = {
	process : function(ctx, step, checkNext) {
		var query = typeof(step.query) != 'undefined' ? step.query : '';
    	util.imgshow().load(query, function(result) {
			ctx.vars[step.var] = result;
			setTimeout(checkNext, 1);
		});
	}
}