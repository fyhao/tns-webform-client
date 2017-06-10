module.exports = {
	
	process : function(ctx, step, next) {
		var name = step.name;
		var value = step.value;
		ctx.wv.ios.stringByEvaluatingJavaScriptFromString("document.getElementById('" + name + "').innerHTML = '" + value + "'");
		setTimeout(next, 1);
	}
}