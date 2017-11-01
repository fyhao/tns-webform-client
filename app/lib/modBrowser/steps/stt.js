var SpeechRecognition =require("nativescript-speech-recognition").SpeechRecognition;
module.exports = {
	
	process : function(ctx, step, next) {
		try {
			var speechRecognition = new SpeechRecognition();
			speechRecognition.available().then(function(status) {
				speechRecognition.startListening({
					locale: "en-US",
					onResult : function(res) {
						ctx.vars[step.result] = res.text;
						setTimeout(next, 1);
					}
				})
				setTimeout(function() {
					speechRecognition.stopListening();
				}, step.timeout);
			});
		} catch(e) {
			alert(e);
		}
	}
}