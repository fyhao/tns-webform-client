module.exports = {
	
	process : function(ctx, step, next) {
		var val = vars[step.var];
		var validated = false;
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
		if(validated) {
			if(step.yes_subflow != null) {
				var tempFlow = null;
				if(typeof ctx.flows != 'undefined') {
					tempFlow = ctx.flows[step.yes_subflow];
				}
				var inputVars = {};
				for(var i in ctx._vars) {
					inputVars[i] = ctx._vars[i];
				}
				new FlowEngine(tempFlow).setContext(ctx).setInputVars(inputVars).execute(function(outputVars) {
					if(typeof outputVars != 'undefined') {
						for(var i in outputVars) {
							ctx._vars[i] = outputVars[i];
						}
					}
					setTimeout(next, 1);
				});
			}
			else {
				setTimeout(next, 1);
			}
		}
		else {
			if(step.no_subflow != null) {
				var tempFlow = null;
				if(typeof ctx.flows != 'undefined') {
					tempFlow = ctx.flows[step.no_subflow];
				}
				var inputVars = {};
				for(var i in ctx._vars) {
					inputVars[i] = ctx._vars[i];
				}
				new FlowEngine(tempFlow).setContext(ctx).setInputVars(inputVars).execute(function(outputVars) {
					if(typeof outputVars != 'undefined') {
						for(var i in outputVars) {
							ctx._vars[i] = outputVars[i];
						}
					}
					setTimeout(next, 1);
				});
			}
			else {
				setTimeout(next, 1);
			}
		}
	}
}