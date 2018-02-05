var util = require('../../../utils/MyUtil');
module.exports = {
	
	process : function(ctx, step, next) {
		if(typeof step.var != 'undefined' && step.code.indexOf('return') == -1) {
			step.code = 'return ' + step.code;
		}
		var isNextWrapperCalled = false;
		var nextWrapper = function() {
			if(isNextWrapperCalled) return;
			setTimeout(next, global.STEP_TIMEOUT);
			isNextWrapperCalled = true;
		}
		
		var val = new Function('vars', 'ctx', 'util', 'next', 'vars; ctx; util; next; ' + step.code);
		ctx.vars[step.var] = val(ctx.vars, ctx, util, nextWrapper);
		if(typeof step.timeout != 'undefined') {
			setTimeout(nextWrapper, step.timeout);
		}
		else {
			setTimeout(next, global.STEP_TIMEOUT);
		}
	}
}