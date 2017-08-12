var util = require('../../../utils/MyUtil');
var activityIndicator = require('../../../utils/nativeActivityIndicator');
module.exports = {
	
	process : function(ctx, step, next) {
		step.callbackJSON = function(json) {
			activityIndicator.disableActivityIndicator();
			//#47 request flow step level
			if(typeof json.flows != 'undefined') {
				for(var i in json.flows) {
					ctx.flows[i] = json.flows[i];
				}
			}
			var flow = json.flow;
			ctx.createFlowEngine(flow).execute(next);
		}
		activityIndicator.enableActivityIndicator();
		util.frequest(step);
	}
}