
module.exports = {
	
	process : function(ctx, step, next) {
		if(step.action == 'start') {
			ctx.timermgr.start(step.id, step.timeout, function() {
				console.log('timermgr success cb');
				//success cb called
				if(typeof step.success_flow != 'undefined') {
					ctx.createFlowEngine(step.success_flow).execute();
				}
			});
			setTimeout(next, global.STEP_TIMEOUT);
		}
		else if(step.action == 'reset') {
			setTimeout(next, global.STEP_TIMEOUT);
		}
		else if(step.action == 'stop') {
			setTimeout(next, global.STEP_TIMEOUT);
		}
		else if(step.action == 'update') {
			setTimeout(next, global.STEP_TIMEOUT);
		}
		else {
			setTimeout(next, global.STEP_TIMEOUT);
		}
	}
}