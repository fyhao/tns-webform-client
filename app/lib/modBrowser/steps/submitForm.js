var modWidget = require('../modWidget.js');
var util = require('../../../utils/MyUtil');
module.exports = {
	
	process : function(ctx, step, next) {
		var paramField = {};
		var showItemWebform = ctx.showItemWebform;
		var wv = ctx.wv;
		var item = ctx.item;
		var params = item.params;
		var endpoint = item.endpoint;
		var submitBtnCallback = function() {
			for(var i = 0; i < params.length; i++) {
				var param = params[i];
				if(typeof param == 'object') {
					// search available widget
					var value = modWidget.parseValue(param, {wv:wv})
					if(value != null)
						paramField[param.name] = {value:value};
				}
				else {
					var value = wv.ios.stringByEvaluatingJavaScriptFromString('document.getElementById("' + param + '").value');
					paramField[param] = {value:value};
				}
			}
		}
		submitBtnCallback();
		var url = endpoint;
		var formParams = {};
		for(var key in paramField) {
			formParams[key] = paramField[key].value;
		}
		
		var method = 'POST';
		if(item.method) method = item.method;
		util.frequest({
			url : url,
			method : method,
			params : formParams,
			
			callbackJSON : function(json) {
				
				if(json.message) {
					alert(json.message);
				}
				if(json.refresh) {
					if(opts.refresh) opts.refresh();
				}
				if(json.webform) {
					showItemWebform(json.webform, {
						refresh:function() {
							if(opts.refresh) opts.refresh();
						}
					});
				}
				if(json.redirectUrl) {
					ctx.showCategory(json.redirectUrl);
				}
				if(json.closewin) {
					//helper.back();
				}
				
				//#47 submit callback level
				
				if(typeof json.flows != 'undefined') {
					for(var i in json.flows) {
						ctx.flows[i] = json.flows[i];
					}
				}
	
				var flow = json.flow;
				ctx.createFlowEngine(flow).execute(function() {});
			}
		});
		setTimeout(next, global.STEP_TIMEOUT);
	}
}
