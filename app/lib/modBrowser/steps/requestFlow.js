module.exports = {
	
	process : function(ctx, step, next) {
		step.callbackJSON = function(json) {
			//#47 request flow step level
			if(typeof json.flows != 'undefined') {
				for(var i in json.flows) {
					ctx.flows[i] = json.flows[i];
				}
			}

			var flow = json.flow;
			if(typeof flow != 'undefined') {
				if(typeof flow == 'object') {
					// flow object
					new FlowEngine(flow).setContext(ctx).execute(next);
				}
				else if(typeof flow == 'string') {
					// flow name
					if(typeof ctx.flows[flow] != 'undefined') {
						new FlowEngine(ctx.flows[flow]).setContext(ctx).execute(next);
					}
				}
				else {
					setTimeout(next, 1);
				}
			}
			else {
				setTimeout(next, 1);
			}
		}
		util.frequest(step);
	}
}