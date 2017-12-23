module.exports = {
	
	process : function(ctx, step, next) {
		ctx.showWebView(step.url);
		setTimeout(next, global.STEP_TIMEOUT);
	}
}