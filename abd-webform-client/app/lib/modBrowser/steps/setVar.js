module.exports = {
	
	process : function(ctx, step, next) {
		if(typeof step.local !== 'undefined') {
			ctx._vars[step.name] = step.value;
		}
		else {
			ctx.vars[step.name] = step.value;
		}
		setTimeout(next, 1);
	}
}