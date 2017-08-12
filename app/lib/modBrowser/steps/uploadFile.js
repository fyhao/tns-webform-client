module.exports = {
	
	process : function(ctx, step, next) {
		var fs = require("file-system");
		var folder = fs.knownFolders.documents();
		var path = fs.path.join(folder.path, step.filename);
		var imageSource = require("image-source");
		var source = new imageSource.ImageSource();
		//ctx._logs.push('entered uploadFile');
		source.fromAsset(ctx.blobVars[step.blob]).then(function(source) {
			var saved = source.saveToFile(path, "png");
			var bghttp = require("nativescript-background-http");
			//ctx._logs.push('bghttp pre session');
			var session = bghttp.session("image-upload");
			//ctx._logs.push('bghttp post session');
			var request = {
				url: step.url,
				method: "POST",
				headers: {
					"Content-Type": "application/octet-stream",
					"File-Name": step.filename
				},
				description: 'uploading file ' + step.filename
			};
			var params = [
				{ name: step.param, filename: path, mimeType: step.filetype }
			];
			task = session.multipartUpload(params, request);

			task.on("progress", logEvent);
			task.on("error", logEvent);
			task.on("complete", logEvent);

			function logEvent(e) {
				console.log(e.eventName);
				//ctx._logs.push('uploadFile logEvent ' + e.eventName);
			}
			setTimeout(next, 1);
		});
	}
}