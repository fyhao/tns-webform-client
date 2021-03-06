var geolocation = require("nativescript-geolocation");
module.exports = {
	getLocation: function(fn) {
		if (!geolocation.isEnabled()) {
			geolocation.enableLocationRequest();
			getLocation(fn);
		}
		else {
			getLocation(fn);
		}
	}
};

var getLocation = function(fn) {
	var location = geolocation.getCurrentLocation({desiredAccuracy: 3, updateDistance: 10, timeout: 20000}).
		then(function(loc) {
			fn(null, loc); //latitude longitude 
		}, function(e){
			console.log("Error: " + e.message);
			fn(e);
		});
}