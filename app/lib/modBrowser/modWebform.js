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
						ctx.createFlowEngine(flow).execute(function() {});
					}
					else if(typeof flow == 'string') {
						// flow name
						if(typeof ctx.flows[flow] != 'undefined') {
							ctx.createFlowEngine(ctx.flows[flow]).execute(function() {});
						}
					}
				}
			}
		});
    });
    gridLayout.addChild(submitBtn);
    
    helpers.navigate(function(){return page;});
	
    
    
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
					ctx.createFlowEngine(ctx.flows[flowName]).execute(function() {});
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
		return new modFlow.FlowEngine(flow).setContext(ctx);
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
			ctx.createFlowEngine(flow).execute(function() {});
		}
		else if(typeof flow == 'string') {
			// flow name
			if(typeof ctx.flows[flow] != 'undefined') {
				ctx.createFlowEngine(ctx.flows[flow]).execute(function() {});
			}
		}
	}
}



module.exports.showItemWebform = showItemWebform;
var _funcs = {};
module.exports.setFunc = function(name, func) {
	_funcs[name] = func;
}