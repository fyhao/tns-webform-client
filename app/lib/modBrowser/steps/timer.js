
module.exports = {
	
	process : function(ctx, step, next) {
		if(step.action == 'start') {
			ctx.timermgr.start(step.id, step.timeout, function() {
				//success cb called
				if(typeof step.success_flow != 'undefined') {
					ctx.createFlowEngine(step.success_flow).execute(function() {});
				}
			}, function() {
				//stop cb called
				if(typeof step.stop_flow != 'undefined') {
					ctx.createFlowEngine(step.stop_flow).execute(function() {});
				}
			});
			setTimeout(next, global.STEP_TIMEOUT);
		}
		else if(step.action == 'reset') {
			ctx.timermgr.reset(step.id);
			setTimeout(next, global.STEP_TIMEOUT);
		}
		else if(step.action == 'stop') {
			ctx.timermgr.stop(step.id);
			setTimeout(next, global.STEP_TIMEOUT);
		}
		else if(step.action == 'get') {
			ctx.vars[step.var] = ctx.timermgr.get(step.id)[step.field];
			setTimeout(next, global.STEP_TIMEOUT);
		}
		else if(step.action == 'update') {
			ctx.timermgr.update(step.id, step.field, step.value);
			setTimeout(next, global.STEP_TIMEOUT);
		}
		else {
			setTimeout(next, global.STEP_TIMEOUT);
		}
	}
}