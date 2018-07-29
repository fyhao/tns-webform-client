var util = require('../../../utils/MyUtil');
module.exports = {
	
	process : function(ctx, step, next) {
		var dialogs = require("ui/dialogs");
		var inputType = dialogs.inputType.text;
		if(typeof step.inputType != 'undefined') {
			inputType = dialogs.inputType[step.inputType];
		}
		// inputType property can be dialogs.inputType.password, dialogs.inputType.text, or dialogs.inputType.email.
		dialogs.prompt({
			title: step.title || "Your title",
			message: step.message || "Your message",
			okButtonText: step.okButtonText || "Your button text",
			cancelButtonText: step.cancelButtonText || "Cancel text",
			neutralButtonText: step.neutralButtonText || "Neutral text",
			defaultText: step.defaultText || "Default text",
			inputType: inputType
		}).then(function (r) {
			//console.log("Dialog result: " + r.result + ", text: " + r.text);
			ctx.vars[step.result] = r;
		});
	}
}