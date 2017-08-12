module.exports = {
	
	process : function(ctx, step, next) {
		ctx.showItemWebform(step.webform, {
			refresh:function() {
				if(opts.refresh) opts.refresh();
			}
		});
		setTimeout(next, 1);
	}
}