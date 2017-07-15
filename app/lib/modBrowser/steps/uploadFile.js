module.exports = {
	
	process : function(ctx, step, next) {
		var fs = require("file-system");
		var folder = fs.knownFolders.documents();
		var path = fs.path.join(folder.path, "Test.png");
		var imageSource = require("image-source");
		var source = new imageSource.ImageSource();
		source.fromAsset(ctx.blobVars[step.blob]).then(function(source) {
			var saved = source.saveToFile(path, "png");
			var bghttp = require("nativescript-background-http");

			var session = bghttp.session("image-upload");

			var request = {
				url: step.url,
				method: "POST",
				headers: {
					"Content-Type": "application/octet-stream"
				},
				description: "{ 'uploading': '" + step.filename + "' }"
			};
			request.headers[step.param] = step.filename;

			var task = session.uploadFile(path, request);

			task.on("progress", logEvent);
			task.on("error", logEvent);
			task.on("complete", logEvent);

			function logEvent(e) {
				console.log(e.eventName);
			}
		});
		
		
		
		setTimeout(next, 1);
	}
}