var sharer = require('../../../utils/nativeSharer');
module.exports = {
	
	process : function(ctx, step, next) {
		if(typeof step.blob != 'undefined') {
			sharer.shareImage(ctx.blobVars[step.blob], next);
		}
		else {
			sharer.shareText(step.content, next);
		}
	}
}