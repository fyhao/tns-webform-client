module.exports = {
	process : function(ctx, step, checkNext) {
		if(typeof step.method === 'undefined') step.method = 'GET';
		var frequestObj = {
			url : step.url,
			method : step.method
		};
		if(typeof step.params !== 'undefined') frequestObj.params = step.params;
		if(typeof step.headers !== 'undefined') frequestObj.headers = step.headers;
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

