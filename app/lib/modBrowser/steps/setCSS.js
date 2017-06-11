module.exports = {
	
	process : function(ctx, step, next) {
		var name = step.name;
		if(typeof styles != 'undefined') {
			for(var style in styles) {
				var value = styles[style];
				setCSSStyle(ctx, style, value);
			}
		}
		else {
			setCSSStyle(ctx, style, value);
		}
		setTimeout(next, 1);
	}
}

var setCSSStyle = function(ctx, style, value) {
	ctx.wv.ios.stringByEvaluatingJavaScriptFromString('document.getElementById("' + name + '").style.' + style + ' = "' + value + '"');
}