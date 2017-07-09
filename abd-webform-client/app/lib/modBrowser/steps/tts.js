var speech = require('../../../utils/nativeSpeech');
module.exports = {
	
	process : function(ctx, step, next) {
		speech.speak(step.text, next);
	}
}