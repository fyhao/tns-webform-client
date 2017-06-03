var util = require('../../../utils/MyUtil');
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
			ctx.createFlowEngine(flow).execute(next);
		}
		util.frequest(step);
	}
}