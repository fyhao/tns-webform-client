module.exports = {
	
	process : function(ctx, step, next) {
		var visibility = 'visible';
		ctx.wv.ios.stringByEvaluatingJavaScriptFromString('document.getElementById("' + step.name + '").style.visibility = "' + visibility + '"');
		setTimeout(next, 1);
	}
}