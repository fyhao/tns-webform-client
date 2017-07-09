var camera = require('../../../utils/nativeCamera');
module.exports = {
	
	process : function(ctx, step, next) {
		camera.takePicture(function(err, imageAsset) {
			if(err) {
				setTimeout(next, 1);
			}
			else {
				var imageModule = require("ui/image");
				var image = new imageModule.Image();
				image.src = imageAsset;
				setTimeout(next, 1);
			}
		});
	}
}

// TODO remove imagemodule testing
// add new ctx.blobVars so that can store imageAsset and also not being executed by replaceVarsStep...
// test blob upload to nodejs and able to see the image properly