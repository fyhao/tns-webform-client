var util = require('../../../utils/MyUtil');
module.exports = {
	
	process : function(ctx, step, next) {
		if(typeof step.end != 'undefined') {
			processLoop(ctx, step, next);
		}
		else if(typeof step.array != 'undefined') {
			processArray(ctx, step, next);
		}
		else {
			setTimeout(next, global.STEP_TIMEOUT);
		}
	}
}

var processLoop = function(ctx, step, next) {
	var start = 0;
	if(typeof step.start != 'undefined') start = parseInt(step.start);
	var end = parseInt(step.end);
	var _step = 1;
	if(typeof step.step != 'undefined') _step = parseInt(step.step);
	var i = start; // for start
	var checkNext = function() {
		if(i < end) { // for end condition
			var vstep = filterStep(step);
			ctx.createFlowEngine(step.flow).setInputVars(vstep).execute(function() {
				i += _step; // for step
				setTimeout(checkNext, global.STEP_TIMEOUT);
			});
		}
		else {
			setTimeout(next, global.STEP_TIMEOUT);
		}
	}
	setTimeout(checkNext, global.STEP_TIMEOUT);
}

var processArray = function(ctx, step, next) {
	var array = ctx.vars[step.array];
	if(array && array.length) {
		var itemName = typeof step.item !== 'undefined' ? step.item : 'item';
		var i = 0;
		var checkNext = function() {
			if(i < array.length) {
				ctx.vars[itemName] = array[i];
				var vstep = filterStep(step);
				ctx.createFlowEngine(step.flow).setInputVars(vstep).execute(function(outputVars) {
					i++;
					setTimeout(checkNext, global.STEP_TIMEOUT);
				});
			}
			else {
				setTimeout(next, global.STEP_TIMEOUT);
			}
		}
		setTimeout(checkNext, global.STEP_TIMEOUT);
	}
	else {
		setTimeout(next, global.STEP_TIMEOUT);
	}
}

var filterStep = function(step) {
	var s = util.clone(step);
	delete s.start;
	delete s.end;
	delete s.step;
	delete s.array;
	delete s.flow;
	return s;
}