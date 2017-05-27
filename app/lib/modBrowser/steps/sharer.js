var sharer = require('../../utils/nativeSharer');
module.exports = {
	
	process : function(ctx, step, next) {
		sharer.shareText(step.content);
		setTimeout(next, 1);
	}
}