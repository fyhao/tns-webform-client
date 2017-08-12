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
var modHTMLRenderer = require('./modHTMLRenderer.js');

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
    
    var wv = new webViewModule.WebView();
    gridLayout.addChild(wv);
	
	var htmlRenderer = new modHTMLRenderer.HTMLRenderer();
	htmlRenderer.init({params:item.params,events:item.events});
	var html = htmlRenderer.renderHTML();
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
    });
    util.setRightNavButton(page, submitBtn);
    
    helpers.navigate(function(){return page;});
	
	// Hook init function in widget
	for(var i = 0; i < params.length; i++) {
    	var param = params[i];
    	modWidget.init(param, {wv:wv});
	}
	
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
		var events = item.events;
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
		if(data == 'ready') {
			console.log('web ready');
			wv.webready = true;
		}
    }
	wv.webready = false;
	wv.runJS = function(js, next) {
		function _run() {
			if(!wv.webready) {
				setTimeout(_run, 100)
			}
			else {
				var value = wv.ios.stringByEvaluatingJavaScriptFromString(js);
				if(next) {
					setTimeout(function() {
						if(next.length == 1) {
							next(value);
						}
						else {
							next();
						}
					}, 1);
				}
			}
		}
		_run();
	}
	wv.runJSSync = function(js) {
		while(!wv.webready) {}
		var value = wv.ios.stringByEvaluatingJavaScriptFromString(js);
		return value;		
	}
    wv.on('loadStarted', _interceptCallsFromWebview)
	
	var ctx = {}; // context object
	ctx.item = item;
	ctx.wv = wv;
	ctx.flows = {};
	ctx.vars = {};
	ctx.blobVars = {};
	ctx._logs = [];
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
	ctx.showCategoryItems = _funcs['showCategoryItems'];
	ctx.showListChooser = _funcs['showListChooser'];
	
	// #47 iterate all webform level flows and put into context flow collection
	if(typeof item.flows != 'undefined') {
		for(var i in item.flows) {
			ctx.flows[i] = item.flows[i];
		}
	}
	
	var flow = item.flow;
	// #47 FlowEngine webform level
	ctx.createFlowEngine(flow).execute(function() {});
	
	// Put in external vars from showItemWebform opts
	if(opts.vars) {
		for(var i in opts.vars) {
			ctx.vars[i] = opts.vars[i];
		}
	}
	
	page.addEventListener(pagesModule.Page.navigatedFromEvent, function(evt) {
		modFlow.FLOW_ENGINE_CANCELED = true;
		ctx.enable_FLOW_ENGINE_CANCELLED();
		console.log('FLOW engine canceled')
	})
  
}

module.exports.showItemWebform = showItemWebform;
var _funcs = {};
module.exports.setFunc = function(name, func) {
	_funcs[name] = func;
}