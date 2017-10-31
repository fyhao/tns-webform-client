module.exports = {
	
	process : function(ctx, step, next) {
		if(step.op == 'get') {
			var comp = getViewById(step.id);
			ctx.vars[step.result] = comp[step.field];
			setTimeout(next, 1);
		}
		else if(step.op == 'set') {
			var comp = getViewById(step.id);
			comp[step.field] = step.value;
			setTimeout(next, 1);
		}
		if(step.op == 'js') {
			var comp = getViewById(step.id);
			ctx.vars['_comp'] = comp;
			var val = new Function('vars', 'vars; ' + step.code);
			ctx.vars[step.var] = val(ctx.vars);
			setTimeout(next, 1);
		}
		else {
			setTimeout(next, 1);
		}
	}
}

var getViewById = function(id) {
	var Frame = require("ui/frame");
	return Frame.topmost().getViewById(id);
}