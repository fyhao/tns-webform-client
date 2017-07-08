var camera = require("nativescript-camera");
module.exports = {
	takePicture: function(fn) {
		camera.requestPermissions();
		camera.takePicture()   
		.then(function (imageAsset) {
			console.log("Result is an image asset instance");
			fn(null, imageAsset);
		}).catch(function (err) {
			console.log("Error -> " + err.message);
			fn(err);
		});
	}
}