var util = require('../../../utils/MyUtil');
module.exports = {
	
	process : function(ctx, step, next) {
		var options = [];
		for(var i = 0; i < step.options.length; i++) {
			var opt = {};
			opt.text = step.options[i];
			opt.func = function() {
				ctx.vars[step.result] = this.text;
				setTimeout(next, 1);
			}
			options.push(opt);
		}
		util.showOptionDialog(options);
	}
}