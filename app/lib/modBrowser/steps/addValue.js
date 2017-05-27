module.exports = {
	
	process : function(ctx, step, next) {
		var name = step.name;
		var value = step.value;
		ctx.wv.ios.stringByEvaluatingJavaScriptFromString('document.getElementById("' + name + '").value += "' + value + '"');
		setTimeout(next, 1);
	}
}