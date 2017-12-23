var setting = require('../../../utils/nativeSetting');
module.exports = {
	process : function(ctx, step, next) {
		setting.setString(step.name, step.value);
		setTimeout(next, global.STEP_TIMEOUT);
	}
}