module.exports = {
	
	process : function(ctx, step, next) {
		var dialog = Ti.UI.createAlertDialog({
			cancel: 1,
			buttonNames: step.buttons,
			message: step.message,
			title: step.title
		  });
		  dialog.addEventListener('click', function(e){
			if(e.index == 0) {
				if(step.yes_subflow != null) {
					var tempFlow = null;
					if(typeof ctx.flows != 'undefined') {
						tempFlow = ctx.flows[step.yes_subflow];
					}
					var inputVars = {};
					for(var i in ctx._vars) {
						inputVars[i] = ctx._vars[i];
					}
					new FlowEngine(tempFlow).setContext(ctx).setInputVars(inputVars).execute(function(outputVars) {
						if(typeof outputVars != 'undefined') {
							for(var i in outputVars) {
								ctx._vars[i] = outputVars[i];
							}
						}
						setTimeout(next, 1);
					});
				}
				else {
					setTimeout(next, 1);
				}
			}
			else {
				if(step.no_subflow != null) {
					var tempFlow = null;
					if(typeof ctx.flows != 'undefined') {
						tempFlow = ctx.flows[step.no_subflow];
					}
					var inputVars = {};
					for(var i in ctx._vars) {
						inputVars[i] = ctx._vars[i];
					}
					new FlowEngine(tempFlow).setContext(ctx).setInputVars(inputVars).execute(function(outputVars) {
						if(typeof outputVars != 'undefined') {
							for(var i in outputVars) {
								ctx._vars[i] = outputVars[i];
							}
						}
						setTimeout(next, 1);
					});
				}
				else {
					setTimeout(next, 1);
				}
			}
		  });
		  dialog.show();
	}
}