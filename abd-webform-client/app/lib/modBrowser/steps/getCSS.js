module.exports = {
	
	process : function(ctx, step, next) {
		var name = step.name;
		var style = step.style;
		ctx.wv.runJS('document.getElementById("' + name + '").style.' + style, function(res) {
			ctx.vars[step.result] = res;
			setTimeout(next, 1);
		});
	}
}