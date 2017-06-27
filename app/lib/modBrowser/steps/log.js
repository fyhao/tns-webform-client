module.exports = {
	
	process : function(ctx, step, next) {
		console.log("LOG: " + new Date().toString() + ": " + step.log);
		setTimeout(next, 1);
	}
}