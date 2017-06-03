var util = require('../../../utils/MyUtil');
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
				ctx.vars[step.varJson] = json;
				setTimeout(checkNext, 1);
			}
		}
		else if(typeof step.var !== 'undefined') {
			frequestObj.callback = function(body) {
				ctx.vars[step.var] = body;
				setTimeout(checkNext, 1);
			}
		}
		else {
			setTimeout(checkNext, 1);
			return;
		}
		util.frequest(frequestObj);
	}
}


var callErrorFlow = function(flow, err) {
	ctx.vars['http_error'] = err;
	ctx.createFlowEngine(flow).execute(function() {
		setTimeout(next, 1);
	});
}