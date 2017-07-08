module.exports = {
	
	process : function(ctx, step, next) {
		var name = step.name;
		var value = ctx.wv.runJS('document.getElementById("' + name + '").value');
		ctx.vars[step.var] = value;
		setTimeout(next, 1);
	}
}