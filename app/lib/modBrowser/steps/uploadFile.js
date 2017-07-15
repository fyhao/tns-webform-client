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
					"Content-Type": "application/octet-stream",
					"File-Name": step.filename
				},
				description: description
			};
			var params = [
				{ name: step.param, filename: path, mimeType: step.filetype }
			];
			console.log(request);
			
			console.log(params);
			task = session.multipartUpload(params, request);

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