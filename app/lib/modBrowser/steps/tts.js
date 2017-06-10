module.exports = {
	
	process : function(ctx, step, next) {
		var _speechSynthesizer = AVSpeechSynthesizer.alloc().init();
		var speechUtterance = AVSpeechUtterance.alloc().initWithString(step.text);
		speechUtterance.rate = 0.3;
		_speechSynthesizer.speakUtterance(speechUtterance);
		setTimeout(next, 1);
	}
}