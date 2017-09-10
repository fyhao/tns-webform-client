module.exports = {
	
	process : function(ctx, step, next) {
		var vars = {};
		if(step.vars && step.vars.length) {
			for(var i = 0; i < step.vars.length; i++) {
				var step_var = step.vars[i];
				vars[step_var] = ctx.vars[step_var];
			}
		}
		var webform = {};
		if(typeof step.webform == 'string') {
			webform = ctx.webforms[step.webform];
		}
		else {
			webform = step.webform;
		}
		ctx.showItemWebform(webform, {
			vars : vars,
			refresh:function() {
				if(opts.refresh) opts.refresh();
			}
		});
		setTimeout(next, 1);
	}
}