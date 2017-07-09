module.exports = {
	
	process : function(ctx, step, next) {
		var visibility = 'hidden';
		ctx.wv.runJS('document.getElementById("' + step.name + '").style.visibility = "' + visibility + '"', next);
	}
}