module.exports = {
	
	process : function(ctx, step, next) {
		
		var utils = require("utils/utils");
		
		var pasteboard = utils.ios.getter(UIPasteboard, UIPasteboard.generalPasteboard);
		  
		try {
			pasteboard.setValueForPasteboardType(step.message, kUTTypePlainText);
		} catch (e) {
			console.log('some error detected')
		}
		  
		setTimeout(next, 1);
	}
}