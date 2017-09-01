module.exports = {
	
	process : function(ctx, step, next) {
		ctx.showItemNSPage(step.page);
		setTimeout(next, 1);
	}
}