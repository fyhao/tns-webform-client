var sharer = require('../../../utils/nativeSharer');
module.exports = {
	
	process : function(ctx, step, next) {
		if(typeof step.blob != 'undefined') {
			var imageSource = require("image-source");
			var source = new imageSource.ImageSource();
			source.fromAsset(ctx.blobVars[step.blob]).then(function(source) {
				sharer.shareImage(source, next);
			});
		}
		else {
			sharer.shareText(step.content, next);
		}
	}
}
//https://docs.nativescript.org/cookbook/image-source