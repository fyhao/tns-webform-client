module.exports = {
	
	process : function(ctx, step, next) {
		console.log('In showPage');
		ctx.showItemNSPage(step.page);
		setTimeout(next, 1);
	}
}