module.exports = {
	
	process : function(ctx, step, next) {
		ctx.showCategory(step.redirectUrl);
		setTimeout(next, 1);
	}
}