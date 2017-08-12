
module.exports = {
	enableActivityIndicator : function() {
		UIApplication.sharedApplication.networkActivityIndicatorVisible = true;
	}
	,
	disableActivityIndicator : function() {
		UIApplication.sharedApplication.networkActivityIndicatorVisible = false;
	}
}