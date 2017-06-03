module.exports = {
	process : function(ctx, step, checkNext) {
		if(typeof step.method === 'undefined') step.method = 'GET';
		var frequestObj = {
			url : step.url,
			method : step.method
		};
		if(typeof step.params !== 'undefined') frequestObj.params = step.params;
		if(typeof step.headers !== 'undefined') frequestObj.headers = step.headers;
		
		if(typeof step.errorFlow !== 'undefined') {
			frequestObj.error = function(err) {
				callErrorFlow(step.errorFlow, err);
			}
		}
		
		if(typeof step.varJson !== 'undefined') {
			frequestObj.callbackJSON = function(json) {
				ctx._vars[step.varJson] = json;
				setTimeout(checkNext, 1);
			}
		}
		else if(typeof step.var !== 'undefined') {
			frequestObj.callback = function(body) {
				ctx._vars[step.var] = body;
				setTimeout(checkNext, 1);
			}
		}
		else {
			setTimeout(checkNext, 1);
			return;
		}
		frequest(frequestObj);
	}
}


var callErrorFlow = function(flow, err) {
	ctx._vars['http_error'] = err;
	var inputVars = {};
	for(var i in ctx._vars) {
		inputVars[i] = ctx._vars[i];
	}
	ctx.createFlowEngine(flow).setInputVars(inputVars).execute(function(outputVars) {
		if(typeof outputVars != 'undefined') {
			for(var i in outputVars) {
				ctx._vars[i] = outputVars[i];
			}
		}
		setTimeout(next, 1);
	});
}