module.exports = {
	
	process : function(ctx, step, next) {
		ctx.vars[step.name] = step.value;
		setTimeout(next, 1);
	}
}