module.exports = {
	
	process : function(ctx, step, next) {
		var name = step.name;
		var style = step.style;
		ctx.vars[step.result] = ctx.wv.runJS('document.getElementById("' + name + '").style.' + style);
		setTimeout(next, 1);
	}
}