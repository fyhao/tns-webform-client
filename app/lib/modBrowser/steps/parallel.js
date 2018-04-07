var util = require('../../../utils/MyUtil');
module.exports = {
	
	process : function(ctx, step, next) {
		if(step.flows && step.flows.length) {
			var noOfTasks = step.flows.length;
			var curExecuted = 0;
			var isDone = false;
			var nextWrapper = function() {
				// done
				if(isDone) return;
				setTimeout(next, global.STEP_TIMEOUT);
				isDone = true;
			}
			var checkNext = function() {
				curExecuted++;
				if(curExecuted == noOfTasks) {
					nextWrapper();
				}
			}
			setTimeout(nextWrapper, step.timeout);
			for(var i = 0; i < step.flows.length; i++) {
				var flow = step.flows[i];
				ctx.createFlowEngine(flow).execute(checkNext);
			}
		}
		else {
			setTimeout(next, global.STEP_TIMEOUT);
		}
	}
}