module.exports = {
	
	process : function(ctx, step, next) {
		var bghttp = require("nativescript-background-http");

		var session = bghttp.session("image-upload");

		var request = {
			url: step.url,
			method: "POST",
			headers: {
				"Content-Type": "application/octet-stream",
				step.param: step.filename
			},
			description: "{ 'uploading': '" + step.filename + "' }"
		};

		var task = session.uploadFile(ctx.blobVars[step.blob], request);

		task.on("progress", logEvent);
		task.on("error", logEvent);
		task.on("complete", logEvent);

		function logEvent(e) {
			console.log(e.eventName);
		}
		setTimeout(next, 1);
	}
}