var geo = require('../../../utils/nativeGeolocation');
module.exports = {
	
	process : function(ctx, step, next) {
		geo.getLocation(function(err, loc) {
			if(err) {
				ctx.vars[step.err] = err;
			}
			else {
				ctx.vars[step.var] = loc;
			}
			setTimeout(next, global.STEP_TIMEOUT);
		});
	}
}