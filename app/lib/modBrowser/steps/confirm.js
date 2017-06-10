var dialogs = require("ui/dialogs");
module.exports = {
	
	process : function(ctx, step, next) {
		var title = step.title ? step.title : 'Confirmation';
		var message = step.message;
		var okButtonText = step.okButtonText ? step.okButtonText : 'OK';
		var cancelButtonText = step.cancelButtonText ? step.cancelButtonText : 'Cancel';
		var neutralButtonText = step.neutralButtonText ? step.neutralButtonText : 'Neutral';
		dialogs.confirm({
			title: title,
			message: message,
			okButtonText: okButtonText,
			cancelButtonText: cancelButtonText,
			neutralButtonText: neutralButtonText
		}).then(function (result) {
			// result argument is boolean
			console.log("Dialog result: " + result);
			ctx.vars[step.result] = result;
			setTimeout(next, 1);
		});
	}
}