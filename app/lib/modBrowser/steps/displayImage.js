var pagesModule = require("ui/page");
var imageModule = require("ui/image");
module.exports = {
	
	process : function(ctx, step, next) {
		var image = new imageModule.Image();
		image.src = step.blob;
		var page = new pagesModule.Page();
		page.content = image;
		helpers.navigate(function(){return page;});
		setTimeout(next, 1);
	}
}