var util = require('../../../utils/MyUtil');
module.exports = {
	
	process : function(ctx, step, next) {
		var options = [];
		for(var i = 0; i < step.options.length; i++) {
			var opt = {};
			opt.text = step.options[i];
			options.push(opt);
		}
		util.showOptionDialog(options, {doneResult:function(result) {
			ctx.vars[step.result] = result;
			setTimeout(next, 1);
		}});
	}
}