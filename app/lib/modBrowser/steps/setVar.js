module.exports = {
	
	process : function(ctx, step, next) {
		ctx._vars[step.name] = step.value;
		if(typeof step.global != 'undefined' && step.global == '1') {
			ctx._vars[step.name] = step.value;
		}
		setTimeout(next, 1);
	}
}