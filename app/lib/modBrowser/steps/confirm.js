var util = require('../../../utils/MyUtil');
module.exports = {
	
	process : function(ctx, step, next) {
		var option_text = ['Yes','No'];
		var options = [];
		for(var i = 0; i < option_text.length; i++) {
			var opt = {};
			opt.text = option_text[i];
			opt.func = function() {
				var res = false;
				if(this.text == 'Yes') {
					res = true;
				}
				ctx.vars[step.result] = res;
				setTimeout(next, global.STEP_TIMEOUT);
			}
			options.push(opt);
		}
		util.showOptionDialog(options, {message:'Please confirm?'});
	}
}