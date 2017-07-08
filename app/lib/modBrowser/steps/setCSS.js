module.exports = {
	
	process : function(ctx, step, next) {
		var name = step.name;
		var styles = step.styles;
		if(typeof styles != 'undefined') {
			var hasStyle = false;
			for(var style in styles) {
				var value = styles[style];
				setCSSStyle(ctx, name, style, value, next);
				hasStyle = true;
			}
			if(!hasStyle) {
				setTimeout(next, 1);
			}
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