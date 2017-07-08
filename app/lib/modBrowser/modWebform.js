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
var modFlow = require('./modFlow.js');
var modWidget = require('./modWidget.js');
var showItemWebform = function(item, opts) {
    
    var page = new pagesModule.Page();
    var gridLayout = new GridLayout();
    page.content = gridLayout;
	
    if(typeof opts == 'undefined') opts = {};
	var endpoint = item.endpoint;
	var params = item.params;
	var submitBtnName = 'Submit';
	if(item.submitBtnName) submitBtnName = item.submitBtnName;
    
    var paramField = {};
    var html = '';
    var wv = new webViewModule.WebView();
    gridLayout.addChild(wv);

    for(var i = 0; i < params.length; i++) {
    	var param = params[i];
    	if(typeof param == 'object') {
    		// search available widget
			html += modWidget.renderWidget(param);
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
		// check selectone
		var oldVal = '';
		var newVal = '';
		if(document.getElementById(widgetName).selectedOptions && document.getElementById(widgetName).selectedOptions.length) {
			oldVal = document.getElementById(widgetName).oldvalue;
			newVal = document.getElementById(widgetName).selectedOptions[0].value;
		}
		else {
			oldVal = document.getElementById(widgetName).oldvalue;
			newVal = document.getElementById(widgetName).value;
		}
		_emitDataToIos("evt:" + widgetName + "_onchange;from=" + oldVal + "&to=" + newVal);
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
	
	_js += '_emitDataToIos("evt:ready");\r\n';

    html += '<script>window.onload = function() { ' + _js + ' }</script>';
    
    wv.src = html;
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

    var submitBtn = new actionBarModule.NavigationButton();
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
					_funcs['showCategory'](json.redirectUrl);
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
				ctx.createFlowEngine(flow).execute(function() {});
			}
		});
    });
    util.setRightNavButton(page, submitBtn);
    
    helpers.navigate(function(){return page;});
	
	// Hook init function in widget
	for(var i = 0; i < params.length; i++) {
    	var param = params[i];
    	modWidget.init(param, {wv:wv});
	}
	
	page.addEventListener(pagesModule.Page.navigatedFromEvent, function(evt) {
		modFlow.FLOW_ENGINE_CANCELED = true;
		console.log('FLOW engine canceled')
	})

        
    var _interceptCallsFromWebview = function (args) {
        var request = args.url;
        var reqMsgProtocol = 'js2ios:';
        var reqMsgStartIndex = request.indexOf(reqMsgProtocol);
        if (reqMsgStartIndex === 0) {
            var reqMsg = decodeURIComponent(request.substring(reqMsgProtocol.length, request.length));
            if(reqMsg.indexOf('evt:') == 0) {
                var temp = reqMsg.substring('evt:'.length);
				var evt = '';
				var evtParams = {};
				if(temp.indexOf(';') > -1) {
					evt = temp.substring(0, temp.indexOf(';'));
					var paramstr = temp.substring(temp.indexOf(';') + 1);
					var paramarr = paramstr.split('&');
					for(var i = 0; i < paramarr.length; i++) {
						var pairarr = paramarr[i].split('=');
						evtParams[pairarr[0]] = pairarr[1];
					}
				}
				else {
					evt = temp;
				}
                handleEventResponse(evt, evtParams);
            }
        }
    }
    var handleEventResponse = function(data, evtParams) {
        console.log('handleEventResponse ' + data + ' ' + JSON.stringify(evtParams));
        for(var _evt in events) {
            if(_evt == data) {
                var e = events[_evt];
				if(typeof e == 'string') {
					var flowName = e;
					ctx.createFlowEngine(flowName).execute(function() {});
				}
                else {
					if(e.changed) {
						var fromValue = e.changed.from;
						var toValue = e.changed.to;
						if(fromValue == evtParams.from && toValue == evtParams.to) {
							var flowName = e.flow;
							ctx.createFlowEngine(flowName).execute(function() {});
						}
					}
					else {
						var flowName = e.flow;
						ctx.createFlowEngine(flowName).execute(function() {});
					}
				}
            }
        }
		else if(data == 'ready') {
			console.log('web ready');
		}
    }

    wv.on('loadStarted', _interceptCallsFromWebview)
	
	var ctx = {}; // context object
	ctx.item = item;
	ctx.wv = wv;
	ctx.flows = {};
	ctx.vars = {};
	ctx.createFlowEngine = function(flow) {
		if(typeof flow != 'undefined') {
			if(typeof flow == 'object') {
				// flow object
				return new modFlow.FlowEngine(flow).setContext(ctx);
			}
			else if(typeof flow == 'string') {
				// flow name
				if(typeof ctx.flows[flow] != 'undefined') {
					return new modFlow.FlowEngine(ctx.flows[flow]).setContext(ctx);
				}
			}
		}
		// return dummy function for silent execution
		return {
			execute : function(next) {
				if(next.length == 1) {
					setTimeout(function() {
						next({});
					}, 1);
				}
				else {
					setTimeout(next, 1);
				}
			}
			,
			setInputVars : function(_vars){
				return this;
			}
		};
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
	ctx.createFlowEngine(flow).execute(function() {});
}

module.exports.showItemWebform = showItemWebform;
var _funcs = {};
module.exports.setFunc = function(name, func) {
	_funcs[name] = func;
}