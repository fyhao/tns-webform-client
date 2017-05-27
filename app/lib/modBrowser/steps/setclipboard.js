module.exports = {
	
	process : function(ctx, step, next) {
		/*
		var utils = require("utils/utils");
		console.log(1);
		var pasteboard = utils.ios.getter(UIPasteboard, UIPasteboard.generalPasteboard);
		  console.log(2);
		  try {
			pasteboard.setValueForPasteboardType(step.message, kUTTypePlainText);
		  } catch (e) {
			console.log('some error detected')
		  }
		  
		  console.log(3);
		  */
		  setTimeout(next, 1);
	}
}