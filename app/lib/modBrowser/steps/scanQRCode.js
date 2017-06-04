var scanner = require('../../../utils/nativeBarcodeScanner.js');
module.exports = {
	
	process : function(ctx, step, next) {
		scanner.scan(function(err, result) {
			if(err) {
				// TODO trigger error flow
				setTimeout(next, 1);
				return;
			}
			ctx.vars[step.result] = result.text;
			setTimeout(next, 1);
		});
	}
}