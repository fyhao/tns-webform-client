var pagesModule = require("ui/page");
var imageModule = require("ui/image");
var helpers = require('../../../utils/widgets/helper');
module.exports = {
	
	process : function(ctx, step, next) {
		var image = new imageModule.Image();
		image.src = ctx.blobVars[step.blob];
		var page = new pagesModule.Page();
		page.content = image;
		helpers.navigate(function(){return page;});
		setTimeout(next, global.STEP_TIMEOUT);
	}
}