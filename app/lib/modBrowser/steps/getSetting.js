var setting = require('../../../utils/nativeSetting');
module.exports = {
	process : function(ctx, step, next) {
		ctx.vars[step.var] = setting.getString(step.name, step.value);
		setTimeout(next, global.STEP_TIMEOUT);
	}
}