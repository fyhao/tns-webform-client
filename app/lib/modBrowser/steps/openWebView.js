module.exports = {
	
	process : function(ctx, step, next) {
		ctx.showWebView(step.url);
		setTimeout(next, 1);
	}
}