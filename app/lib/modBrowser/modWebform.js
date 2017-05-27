var pagesModule = require("ui/page");
var StackLayout = require("ui/layouts/stack-layout").StackLayout;
var GridLayout = require("ui/layouts/grid-layout").GridLayout;
var webViewModule = require("ui/web-view");
var buttonModule = require("ui/button");
var textFieldModule = require("ui/text-field");
var textViewModule = require("ui/text-view");
var listPickerModule = require("ui/list-picker");
var listViewModule = require("ui/list-view");
var labelModule = require("ui/label");
var actionBarModule = require("ui/action-bar");
var util = require('../../utils/MyUtil');
var helpers = require('../../utils/widgets/helper');
var sharer = require('../../utils/nativeSharer.js');
var clipboard = require('../../utils/nativeClipboard.js');
var modStep = require('./modStep.js');
var showItemWebform = function(item, opts) {
    
    var page = new pagesModule.Page();
    var gridLayout = new GridLayout();
    page.content = gridLayout;
	
    if(typeof opts == 'undefined') opts = {};
	var endpoint = item.endpoint;
	var params = item.params;
	var submitBtnName = 'Submit';
	if(item.submitBtnName) submitBtnName = item.submitBtnName;
    
    
    var parseParamOptions = function(options) {
    	if(!options.length) {
    		// object, not array
    		var temp = [];
    		for(var k in options) {
    			var v = options[k];
    			temp.push({value:k,key:v});
    		}
    		options = temp;
    		temp = null;
    	}
    	else {
    		// is array
    		var temp = [];
    		for(var k in options) {
    			var v = options[k];
    			if(typeof v != 'object') {
    				temp.push({value:v,key:v});
    			}
    			else {
    				return options;
    			}
    		}
    		options = temp;
    		temp = null;
    	}
    	return options;
    }
    var paramField = {};
    var html = '';
    var wv = new webViewModule.WebView();
    gridLayout.addChild(wv);

    for(var i = 0; i < params.length; i++) {
    	var param = params[i];
    	if(typeof param == 'object') {
    		if(param.type == 'selectone') {
    			param.options = parseParamOptions(param.options);
    			html += '<select id="' + param.name + '">';
    			for(var j = 0; j < param.options.length; j++) {
    				var key = param.options[j]['key'];
    				var val = param.options[j]['value'];
    				var selected = param.def && param.def == val;
    				var selectedStr = selected ? ' selected' : '';
    				html += '<option value="' + val + '" ' + selectedStr + '>' + key + '</option>';
    			}
    			html += '</select>';
    		}
    		else if(param.type == 'text') {
    			var def = typeof(param.def) != 'undefined' ? param.def : '';
    			html += '<input type="text" id="' + param.name + '" value="' + def + '" placeholder="' + param.name + '" cols="100" />';
    		}
    		else if(param.type == 'textarea') {
    			var def = typeof(param.def) != 'undefined' ? param.def : '';
    			html += '<textarea id="' + param.name + '">' + def + '</textarea>';
    		}
    		else if(param.type == 'label') {
    			html += '<span id="' + param.id + '">' + param.name + '</span>';
    		}
    		else if(param.type == 'hidden') {
    			var def = typeof(param.def) != 'undefined' ? param.def : '';
    			html += '<input type="hidden" id="' + param.name + '" value="' + def + '" />';
    		}
    	}
    	else {
    		html += '<input type="text" id="' + param + '" value="" placeholder="' + param + '" />';
    	}
    	html += '<br />';
    }

    html = '<meta name = "viewport" content = "width = 320,initial-scale = 1.0, user-scalable = no"/>'
    + '<meta name = "viewport" content = "width = device-width"/>'
    + '<meta name = "viewport" content = "initial-scale = 1.0"/>'
    + '<meta name = "viewport" content = "initial-scale = 1.0, user-scalable = no"/>' + html;

    html = '<style type="text/css">'
    + 'input[type=text]{width:360px;height:35px;font-size:16px;}'
    + 'textarea{width:360px;font-size:16px;height:500px;}'
    + 'select{height:30px;font-size:16px;width:360px;}'
    + 'input,textarea,select{margin:5 0 0 5;}'
    + '</style>' + html;

    html += `<script>var _createIFrame = function (src) {
    var rootElm = document.documentElement;
    var newFrameElm = document.createElement("IFRAME");
    newFrameElm.setAttribute("src", src);
    rootElm.appendChild(newFrameElm);
    return newFrameElm;
};
var _emitDataToIos = function (data) {
    var url = "js2ios:" + data;
    var iFrame = _createIFrame(url);
    iFrame.parentNode.removeChild(iFrame);
};

var handleClick = function(widgetName) {
    return function(e) {
        _emitDataToIos("evt:" + widgetName + "_onclick");
    }
};

var handleChange = function(widgetName) {
    return function(e) {
        _emitDataToIos("evt:" + widgetName + "_onchange");
    }
};
</script>`;

	var events = item.events;
    var _js = '';
    if(typeof events != 'undefined') {
        for(var _evt in events) {
            var _arr = _evt.split('_');
            if(_arr.length != 2) continue;
            var widgetName = _arr[0];
            var eventName = _arr[1];
            if(eventName == 'onclick') {
                _js += 'document.getElementById("' + widgetName + '").addEventListener("click", handleClick("' + widgetName + '"));\n\n';
            	
            }
			else if(eventName == 'onchange') {
                _js += 'document.getElementById("' + widgetName + '").addEventListener("change", handleChange("' + widgetName + '"));\n\n';
            	
            }
        }
    }

    html += '<script>window.onload = function() { ' + _js + ' }</script>';
    
    wv.src = html;
    var submitBtnCallback = function() {
    	for(var i = 0; i < params.length; i++) {
    		var param = params[i];
    		if(typeof param == 'object') {
    			if(param.type == 'label') continue;
    			if(param.type == 'selectone') {
                    //wv.ios.stringByEvaluatingJavaScriptFromString(strJSFunction);
    				var value = wv.ios.stringByEvaluatingJavaScriptFromString('document.getElementById("' + param.name + '").selectedOptions[0].value');
    				paramField[param.name] = {value:value};
                    
    			}
    			else {
    				var value = wv.ios.stringByEvaluatingJavaScriptFromString('document.getElementById("' + param.name + '").value');
    				paramField[param.name] = {value:value};
                  
    			}
    		}
    		else {
    			var value = wv.ios.stringByEvaluatingJavaScriptFromString('document.getElementById("' + param + '").value');
    			paramField[param] = {value:value};
               
    		}
    	}
    	
    }

    var submitBtn = new buttonModule.Button();
    submitBtn.text = 'Submit';
    submitBtn.height = 44;
    submitBtn.on(buttonModule.Button.tapEvent, function (args) {
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
					showCategory(json.redirectUrl);
				}
				if(json.closewin) {
					topmost.goBack();
				}
				
				//#47 submit callback level
				
				if(typeof json.flows != 'undefined') {
					for(var i in json.flows) {
						ctx.flows[i] = json.flows[i];
					}
				}
	
				var flow = json.flow;
				if(typeof flow != 'undefined') {
					if(typeof flow == 'object') {
						// flow object
						new FlowEngine(flow).setContext(ctx).execute(function() {});
					}
					else if(typeof flow == 'string') {
						// flow name
						if(typeof ctx.flows[flow] != 'undefined') {
							new FlowEngine(ctx.flows[flow]).setContext(ctx).execute(function() {});
						}
					}
				}
			}
		});
    });
    gridLayout.addChild(submitBtn);
    
    helpers.navigate(function(){return page;});
	
    
    
	page.addEventListener(pagesModule.Page.navigatedFromEvent, function(evt) {
		FLOW_ENGINE_CANCELED = true;
		console.log('FLOW engine canceled')
	})

        
    var _interceptCallsFromWebview = function (args) {
        var request = args.url;
        var reqMsgProtocol = 'js2ios:';
        var reqMsgStartIndex = request.indexOf(reqMsgProtocol);
        if (reqMsgStartIndex === 0) {
            var reqMsg = decodeURIComponent(request.substring(reqMsgProtocol.length, request.length));
            if(reqMsg.indexOf('evt:') == 0) {
                var data = reqMsg.substring('evt:'.length);
                handleEventResponse(data);
            }
        }
    }
    var handleEventResponse = function(data) {
        console.log('handleEventResponse ' + data)
        for(var _evt in events) {
            if(_evt == data) {
                var flowName = events[_evt];
                if(typeof ctx.flows[flowName] != 'undefined') {
					new FlowEngine(ctx.flows[flowName]).setContext(ctx).execute(function() {});
				}
            }
        }
    }

    wv.on('loadStarted', _interceptCallsFromWebview)
	
	var ctx = {}; // context object
	ctx.item = item;
	ctx.wv = wv;
	ctx.flows = {};
	ctx.vars = {};
	ctx.createFlowEngine = function(flow) {
		return new FlowEngine(flow).setContext(ctx);
	}
	ctx.showItemWebform = showItemWebform;
	ctx.showCategory = _funcs['showCategory'];
	ctx.showWebView = _funcs['showWebView'];
	
	// #47 iterate all webform level flows and put into context flow collection
	if(typeof item.flows != 'undefined') {
		for(var i in item.flows) {
			ctx.flows[i] = item.flows[i];
		}
	}
	
	var flow = item.flow;
	// #47 FlowEngine webform level
	if(typeof flow != 'undefined') {
		if(typeof flow == 'object') {
			// flow object
			new FlowEngine(flow).setContext(ctx).execute(function() {});
		}
		else if(typeof flow == 'string') {
			// flow name
			if(typeof ctx.flows[flow] != 'undefined') {
				new FlowEngine(ctx.flows[flow]).setContext(ctx).execute(function() {});
			}
		}
	}
}


FLOW_ENGINE_CANCELED = false;
var FlowEngine = function(flow) {
	FLOW_ENGINE_CANCELED = false;
	var vars = {};
	var wv = null;
	this.setWv = function(v) {
		wv = v;
		return this;
	}
	var item = null;
	this.setItem = function(v) {
		item = v;
		return this;
	}
	var ctx = {};
	this.setContext = function(v) {
		ctx = v;
		wv = ctx.wv;
		item = ctx.item;
		// initialize ctx._vars for local var for step use
		ctx._vars = vars;
		return this;
	}
	this.setInputVars = function(v) {
		for(var i in v) {
			ctx._vars[i] = v[i];
		}
		return this;
	}
	this.flow = util.clone(flow);
	this.canceled = false;
	
	this.execute = function(done) {
		console.log('Execute')
		var steps = this.flow.steps;
		if(steps && steps.length) {
			var curStep = -1;
			var checkNext = function() {
				curStep++;
				if(curStep < steps.length) {
					processStep(steps[curStep], checkNext);
				}
				else {
					if(done.length == 1) {
						setTimeout(function() {
							var outputVars = {};
							for(var i in ctx._vars) {
								outputVars[i] = ctx._vars[i];
							}
							done(outputVars);
						}, 1);
					}
					else {
						setTimeout(done, 1);
					}
				}
			}
			setTimeout(checkNext, 300);
		}
	}
	this.cancel = function() {
		this.canceled = true;
	}
	var replaceVars = function(c) {
		for(var k in ctx._vars) {
			c = util.replaceAll(c, '##' + k + '##', ctx._vars[k]);
		}
		for(var k in ctx.vars) {
			c = util.replaceAll(c, '##' + k + '##', ctx.vars[k]);
		}
		return c;
	}
	var replaceVarsStep = function(step) {
		for(var i in step) {
			if(typeof step[i] != 'string') {
				step[i] = replaceVarsStep(step[i]);
			}
			else {
				step[i] = replaceVars(step[i]);
			}
		}
		return step;
	}
	var processStep = function(step, next) {
		console.log('processStep ' + FLOW_ENGINE_CANCELED);
		console.log(JSON.stringify(step)); 
		//console.log(JSON.stringify(ctx._vars));
		if(FLOW_ENGINE_CANCELED) {
			return;
		}
		step = replaceVarsStep(step);
		//console.log(JSON.stringify(step)); 
		// search ctx.flows if any
		if(typeof ctx.flows != 'undefined') {
			var flow = ctx.flows[step.type];
			//console.log('search flow ' + step.type + " = " + (typeof flow));
			if(typeof flow != 'undefined') {
				var inputVars = {};
				for(var i in step) {
					if(i == 'type') continue;
					if(i == 'inputall') continue;
					inputVars[i] = step[i];
				}
				if(typeof step.inputall != 'undefined' && step.inputall) {
					for(var i in ctx._vars) {
						inputVars[i] = ctx._vars[i];
					}
				}
				new FlowEngine(flow).setContext(ctx).setInputVars(inputVars).execute(function(outputVars) {
					if(typeof outputVars != 'undefined') {
						for(var i in outputVars) {
							ctx._vars[i] = outputVars[i];
						}
					}
					setTimeout(next, 1);
				});
			}
			else {
				// search step modules if any
				modStep.processStep(ctx, step, next);
			}
		}
		else {
			// search step modules if any
			modStep.processStep(ctx, step, next);
		}
		
	}
}

module.exports.showItemWebform = showItemWebform;
var _funcs = {};
module.exports.setFunc = function(name, func) {
	_funcs[name] = func;
}