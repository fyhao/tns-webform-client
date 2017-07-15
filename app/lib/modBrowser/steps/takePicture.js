var camera = require('../../../utils/nativeCamera');
var helpers = require('../../../utils/widgets/helper');

module.exports = {
	
	process : function(ctx, step, next) {
		camera.takePicture(function(err, imageAsset) {
			if(err) {
				setTimeout(next, 1);
			}
			else {
				ctx.blobVars[step.result] = imageAsset;
				// test display image
				var image = new imageModule.Image();
				image.src = imageAsset;
				var page = new pagesModule.Page();
				page.content = image;
				helpers.navigate(function(){return page;});
				setTimeout(next, 1);
			}
		});
	}
}

// TODO remove imagemodule testing
// add new ctx.blobVars so that can store imageAsset and also not being executed by replaceVarsStep...
// test blob upload to nodejs and able to see the image properly