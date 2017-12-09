module.exports = {
	
	process : function(ctx, step, next) {
		if(typeof step.var != 'undefined' && step.code.indexOf('return') == -1) {
			step.code = 'return ' + step.code;
		}
		var val = new Function('vars', 'vars; ' + step.code);
		ctx.vars[step.var] = val(ctx.vars);
		setTimeout(next, global.STEP_TIMEOUT);
	}
}