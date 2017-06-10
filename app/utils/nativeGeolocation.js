var geolocation = require("nativescript-geolocation");
module.exports = {
	getLocation: function(fn) {
		if (!geolocation.isEnabled()) {
			geolocation.enableLocationRequest();
		}
		var location = geolocation.getCurrentLocation({desiredAccuracy: 3, updateDistance: 10, maximumAge: 20000, timeout: 20000}).
		then(function(loc) {
			fn(null, loc); //latitude longitude 
		}, function(e){
			console.log("Error: " + e.message);
			fn(e);
		});
	}
};