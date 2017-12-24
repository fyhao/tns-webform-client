module.exports = {
	
	process : function(ctx, step, next) {
		if(typeof step.tick == 'undefined') step.tick = 10;
		if(typeof step.timeout == 'undefined') step.timeout = 1000;
		step.tick = parseInt(step.tick);
		step.timeout = parseInt(step.timeout);
		monitor(ctx, step, next);
	}
}

var monitor = function(ctx, step, next) {
	var startTime = new Date().getTime();
	var _check = function() {
		var nowTime = new Date().getTime();
		if(nowTime - startTime > step.timeout) { // timeout-ed
			if(typeof step.on_fail != 'undefined') {
				ctx.createFlowEngine(step.on_fail).execute(next);
			}
			else {
				setTimeout(next, global.STEP_TIMEOUT);
			}
		}
		else { // not timeout, re check after tick
			if(ctx.vars[step.var] == step.value) {
				if(typeof step.on_success != 'undefined') {
					ctx.createFlowEngine(step.on_success).execute(next);
				}
				else {
					setTimeout(next, global.STEP_TIMEOUT);
				}
			}
			else {
				setTimeout(_check, step.tick);
			}
		}
	}
	setTimeout(_check, step.tick);
}