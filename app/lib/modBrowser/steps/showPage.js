module.exports = {
	
	process : function(ctx, step, next) {
		//console.log('In showPage');
		var page = {};
		if(typeof step.page == 'string') {
			page = ctx.pages[step.page];
		}
		else {
			page = step.page;
		}
		ctx.showItemNSPage(step.page);
		setTimeout(next, 1);
	}
}