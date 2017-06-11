module.exports = {
	
	process : function(ctx, step, next) {
		var name = step.name;
		var styles = step.styles;
		if(typeof styles != 'undefined') {
			for(var style in styles) {
				var value = styles[style];
				setCSSStyle(ctx, name, style, value);
			}
		}
		else {
			var style = step.style;
			var value = step.value;
			setCSSStyle(ctx, name, style, value);
		}
		setTimeout(next, 1);
	}
}

var setCSSStyle = function(ctx, name, style, value) {
	ctx.wv.ios.stringByEvaluatingJavaScriptFromString('document.getElementById("' + name + '").style.' + style + ' = "' + value + '"');
}