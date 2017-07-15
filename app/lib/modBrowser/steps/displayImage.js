var pagesModule = require("ui/page");
var helpers = require('../../../utils/widgets/helper');
module.exports = {
	
	process : function(ctx, step, next) {
		var page = new pagesModule.Page();
		page.content = ctx.blobVars[step.blob];
		helpers.navigate(function(){return page;});
		setTimeout(next, 1);
	}
}