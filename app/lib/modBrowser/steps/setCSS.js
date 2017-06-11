module.exports = {
	
	process : function(ctx, step, next) {
		var name = step.name;
		var style = step.style;
		var value = step.value;
		ctx.wv.ios.stringByEvaluatingJavaScriptFromString('document.getElementById("' + name + '").style.' + style + ' = "' + value + '"');
		setTimeout(next, 1);
	}
}