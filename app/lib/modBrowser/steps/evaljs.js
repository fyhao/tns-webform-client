module.exports = {
	
	process : function(ctx, step, next) {
		if(typeof step.var != 'undefined' && step.code.indexOf('return') == -1) {
			step.code = 'return ' + step.code;
		}
		var val = new Function('vars', 'ctx', 'next', 'vars; ctx; next; ' + step.code);
		ctx.vars[step.var] = val(ctx.vars, ctx, next);
		setTimeout(next, global.STEP_TIMEOUT);
	}
}