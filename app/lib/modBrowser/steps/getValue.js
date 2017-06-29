module.exports = {
	
	process : function(ctx, step, next) {
		var name = step.name;
		var value = ctx.wv.ios.stringByEvaluatingJavaScriptFromString('document.getElementById("' + name + '").value');
		console.log('getValue ' + name + ' = ' + value)
		ctx.vars[step.var] = value;
		setTimeout(next, 1);
	}
}