module.exports = {
	
	process : function(ctx, step, next) {
		var delay = typeof step.delay != 'undefined' ? parseInt(step.delay) : 1;
		setTimeout(function() {
			ctx.createFlowEngine(step.flow).execute(function() {});
		}, delay);
		setTimeout(next, global.STEP_TIMEOUT);
	}
}