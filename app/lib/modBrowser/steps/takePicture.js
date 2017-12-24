var camera = require('../../../utils/nativeCamera');
var imageModule = require("ui/image");
module.exports = {
	
	process : function(ctx, step, next) {
		camera.takePicture(function(err, imageAsset) {
			if(err) {
				setTimeout(next, global.STEP_TIMEOUT);
			}
			else {
				var image = new imageModule.Image();
				image.src = imageAsset;
				ctx.blobVars[step.blob] = imageAsset;
				setTimeout(next, global.STEP_TIMEOUT);
			}
		});
	}
}

// TODO remove imagemodule testing
// add new ctx.blobVars so that can store imageAsset and also not being executed by replaceVarsStep...
// test blob upload to nodejs and able to see the image properly