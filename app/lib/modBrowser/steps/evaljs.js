module.exports = {
	
	process : function(ctx, step, next) {
		var val = eval('vars = ' + JSON.stringify(ctx.vars) + '; ' + step.code);
		ctx.vars[step.var] = val;
		setTimeout(next, 1);
	}
}