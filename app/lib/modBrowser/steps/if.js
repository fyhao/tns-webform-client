module.exports = {
	
	process : function(ctx, step, next) {
		var val = ctx.vars[step.var];
		var validated = false;
		if(typeof step.expr !== 'undefined') {
			validated = eval('vars = ' + JSON.stringify(ctx.vars) + '; ' + step.expr);
		}
		else {
			if(step.if == 'contains') {
				validated = val.indexOf(step.pattern) != -1;
			}
			else if(step.if == 'equal') {
				//console.log('execute if [' + val + '] = [' + step.pattern + ']');
				validated = val == step.pattern;
			}
			else if(step.if == 'eq') {
				//console.log('execute if [' + val + '] = [' + step.pattern + ']');
				validated = val == step.pattern;
			}
			else if(step.if == 'neq') {
				//console.log('execute if [' + val + '] = [' + step.pattern + ']');
				validated = val != step.pattern;
			}
		}
		if(validated) {
			if(step.yes_subflow != null) {
				ctx.createFlowEngine(step.yes_subflow).execute(function() {
					setTimeout(next, global.STEP_TIMEOUT);
				});
			}
			else {
				setTimeout(next, global.STEP_TIMEOUT);
			}
		}
		else {
			if(step.no_subflow != null) {
				ctx.createFlowEngine(step.no_subflow).execute(function() {
					setTimeout(next, global.STEP_TIMEOUT);
				});
			}
			else {
				setTimeout(next, global.STEP_TIMEOUT);
			}
		}
	}
}