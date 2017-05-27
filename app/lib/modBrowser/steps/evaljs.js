module.exports = {
	
	process : function(ctx, step, next) {
		var val = eval('vars = ' + JSON.stringify(vars) + '; ' + step.code);
		ctx._vars[step.var] = val;
		setTimeout(next, 1);
	}
}