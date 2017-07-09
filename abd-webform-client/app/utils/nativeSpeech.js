// text to speech and speech recognition

module.exports = {
	speak : function(text, done) {
		/// javascript
		try {
			var TextToSpeech = require("nativescript-texttospeech");

			var TNSTextToSpeech = TextToSpeech.TNSTextToSpeech;
			
			var TTS = new TNSTextToSpeech();

			var speakOptions = {
				text: text, /// *** required ***
				speakRate: 0.5, // optional - default is 1.0
				pitch: 1.0, // optional - default is 1.0
				volume: 1.0, // optional - default is 1.0
				language: "en-GB",  // optional - default is system language,
				finishedCallback: function(){ done() } // optional
			}

			// Call the `speak` method passing the SpeakOptions object
			TTS.speak(speakOptions);
		} catch (e) {
			alert(e)
			done()
		}
	}
}