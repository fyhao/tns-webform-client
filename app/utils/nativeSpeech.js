// text to speech and speech recognition

module.exports = {}
	speak : function(text) {
		/// javascript
		var TextToSpeech = require("nativescript-texttospeech");

		var TNSTextToSpeech = TextToSpeech.TNSTextToSpeech;
		var SpeakOptions = TextToSpeech.SpeakOptions;
		
		var TTS = new TNSTextToSpeech();

		var speakOptions: SpeakOptions = {
			text: text, /// *** required ***
			speakRate: 0.5 // optional - default is 1.0
			pitch: 1.0 // optional - default is 1.0
			volume: 1.0 // optional - default is 1.0
			language: "en-GB"  // optional - default is system language,
			finishedCallback: Function // optional
		}

		// Call the `speak` method passing the SpeakOptions object
		TTS.speak(speakOptions);
	}
}