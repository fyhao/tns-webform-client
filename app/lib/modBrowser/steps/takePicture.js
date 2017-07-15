var camera = require('../../../utils/nativeCamera');
var helpers = require('../../../utils/widgets/helper');
var pagesModule = require("ui/page");
var imageModule = require("ui/image");
module.exports = {
	
	process : function(ctx, step, next) {
		camera.takePicture(function(err, imageAsset) {
			if(err) {
				setTimeout(next, 1);
			}
			else {
				var image = new imageModule.Image();
				image.src = imageAsset;
				ctx.blobVars[step.result] = image;
				// test display image
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