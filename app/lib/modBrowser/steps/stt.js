var SpeechRecognition =require("nativescript-speech-recognition").SpeechRecognition;
module.exports = {
	
	process : function(ctx, step, next) {
		var locale = typeof(step.locale) != 'undefined' ? step.locale : 'en-US';
		try {
			var speechRecognition = new SpeechRecognition();
			speechRecognition.available().then(function(status) {
				if(typeof step.timeout != 'undefined') {
					speechRecognition.startListening({
						locale: locale,
						onResult : function(res) {
							ctx.vars[step.result] = res.text;
							setTimeout(next, 1);
						}
					})
					setTimeout(function() {
						speechRecognition.stopListening();
					}, step.timeout);
				}
				else if(typeof step.action != 'undefined') {
					if(step.action == 'startListening') {
						speechRecognition.startListening({
							locale: locale,
							onResult : function(res) {
								ctx.vars[step.result] = res.text;
							}
						});
					}
					else if(step.action == 'stopListening') {
						speechRecognition.stopListening();
					}
					setTimeout(next, 1);
				}
			});
		} catch(e) {
			alert(e);
		}
	}
}