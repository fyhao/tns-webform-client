var SpeechRecognition =require("nativescript-speech-recognition").SpeechRecognition;
module.exports = {
	
	process : function(ctx, step, next) {
		var locale = typeof(step.locale) != 'undefined' ? step.locale : 'en-US';
		try {
			var speechRecognition = null;
			if(typeof ctx.speechRecognition == 'undefined') {
				speechRecognition = new SpeechRecognition();
				ctx.speechRecognition = speechRecognition;
			}
			else {
			    speechRecognition = ctx.speechRecognition;
			}
			
			speechRecognition.available().then(function(status) {
				if(typeof step.timeout != 'undefined') {
					speechRecognition.startListening({
						locale: locale,
						onResult : function(res) {
							ctx.vars[step.result] = res.text;
							speechRecognition = null;
							delete ctx['speechRecognition'];
							setTimeout(next, global.STEP_TIMEOUT);
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
								speechRecognition = null;
								delete ctx['speechRecognition'];
							}
						});
					}
					else if(step.action == 'stopListening') {
						speechRecognition.stopListening();
					}
					setTimeout(next, global.STEP_TIMEOUT);
				}
			});
		} catch(e) {
			alert(e);
		}
	}
}