var util = require('../../../utils/MyUtil');
var activityIndicator = require('../../../utils/nativeActivityIndicator');
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
				activityIndicator.disableActivityIndicator();
				setTimeout(checkNext, global.STEP_TIMEOUT);
			}
		}
		else if(typeof step.var !== 'undefined') {
			frequestObj.callback = function(body) {
				ctx.vars[step.var] = body;
				activityIndicator.disableActivityIndicator();
				setTimeout(checkNext, global.STEP_TIMEOUT);
			}
		}
		else {
			activityIndicator.disableActivityIndicator();
			setTimeout(checkNext, global.STEP_TIMEOUT);
			return;
		}
		activityIndicator.enableActivityIndicator();
		util.frequest(frequestObj);
	}
}


var callErrorFlow = function(flow, err) {
	ctx.vars['http_error'] = err;
	ctx.createFlowEngine(flow).execute(function() {
		activityIndicator.disableActivityIndicator();
		setTimeout(next, global.STEP_TIMEOUT);
	});
}