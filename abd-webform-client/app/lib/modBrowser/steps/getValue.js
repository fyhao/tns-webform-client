module.exports = {
	
	process : function(ctx, step, next) {
		var name = step.name;
		ctx.wv.runJS('document.getElementById("' + name + '").value', function(value) {
			ctx.vars[step.var] = value;
			setTimeout(next, 1);
		});
	}
}