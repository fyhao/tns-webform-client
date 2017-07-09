module.exports = {
	
	process : function(ctx, step, next) {
		var name = step.name;
		var value = step.value;
		ctx.wv.runJS('document.getElementById("' + name + '").value = "' + value + '"', next);
	}
}