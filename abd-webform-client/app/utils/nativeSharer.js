var frameModule = require("ui/frame");
var utilsModule = require("utils/utils");

function share(thingToShare, next) {
	var activityController = UIActivityViewController.alloc()
		.initWithActivityItemsApplicationActivities([thingToShare], null);
	var presentViewController = activityController.popoverPresentationController;
	if (presentViewController) {
		var page = frameModule.topmost().currentPage;
		if (page && page.ios.navigationItem.rightBarButtonItems &&
			page.ios.navigationItem.rightBarButtonItems.count > 0) {
			presentViewController.barButtonItem = page.ios.navigationItem.rightBarButtonItems[0];
		} else {
			presentViewController.sourceView = page.ios.view;
		}
	}
	activityController.completionWithItemsHandler = function(activity, success, items, error) {
		setTimeout(next, 1);
	}
	utilsModule.ios.getter(UIApplication, UIApplication.sharedApplication)
		.keyWindow
		.rootViewController
		.presentViewControllerAnimatedCompletion(activityController, true, null);
}

module.exports = {
	shareImage: function(image, next) {
		if(typeof next == 'undefined') next = function() {};
		share(image, next);
	},
	shareText: function(text, next) {
		if(typeof next == 'undefined') next = function() {};
		share(text, next);
	}
};