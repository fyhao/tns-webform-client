var util = require('../../../utils/MyUtil');
module.exports = {
	
	process : function(ctx, step, next) {
		var options = [];
		for(var i = 0; i < step.options.length; i++) {
			var opt = {};
			opt.text = step.options[i];
			options.push(opt);
		}
		util.showOptionDialog(options, {doneResult:function(result, selectedOption) {
			ctx.vars[step.result] = result;
			if(selectedOption && selectedOption.id && step.selectedId) {
				ctx.vars[step.selectedId] = selectedOption.id;
			}
			setTimeout(next, global.STEP_TIMEOUT);
		}});
	}
}