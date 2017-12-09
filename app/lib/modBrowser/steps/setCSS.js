module.exports = {
	
	process : function(ctx, step, next) {
		var name = step.name;
		var styles = step.styles;
		if(typeof styles != 'undefined') {
			for(var style in styles) {
				var value = styles[style];
				setCSSStyleSync(ctx, name, style, value);
			}
			setTimeout(next, global.STEP_TIMEOUT);
		}
		else {
			var style = step.style;
			var value = step.value;
			setCSSStyle(ctx, name, style, value, next);
		}
	}
}

var setCSSStyle = function(ctx, name, style, value, next) {
	ctx.wv.runJS('document.getElementById("' + name + '").style.' + style + ' = "' + value + '"', next);
}
var setCSSStyleSync = function(ctx, name, style, value) {
	ctx.wv.runJSSync('document.getElementById("' + name + '").style.' + style + ' = "' + value + '"');
}