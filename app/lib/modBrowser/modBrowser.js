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
module.exports.createBrowser = function() {
	return new Browser();
}

function Browser() {
	this.open = function(url) {
		showCategory(url);
	}
}

function showCategory(url) {
    var page = new pagesModule.Page();
    var loadData = function() {
        var listView = new listViewModule.ListView();
        page.content = listView;
    
        util.frequest({
            url : url,
            callbackJSON : function(data) {
                
                listView.items = data.list;
                listView.on(listViewModule.ListView.itemLoadingEvent, function (args1) {
                    if (!args1.view) {
                        // Create label if it is not already created.
                        args1.view = new labelModule.Label();
                        args1.view.height = 44;
                    }
                    args1.view.data = data.list[args1.index];
                    args1.view.text = data.list[args1.index].title;

                });
                listView.on(listViewModule.ListView.itemTapEvent, function (args2) {
                    var tappedItemIndex = args2.index;
                    var tappedItemView = args2.view;
                    var item = tappedItemView.data;
                    showItem(item);
                });
            }
        });
    }
    
    loadData();
    helpers.navigate(function(){return page;});
}
function showItem(item) {
    if(item.type == 'url') {
        if(item.content.indexOf('youtube') != -1 || item.content.indexOf('.mp4') != -1) {
            showItemVideo(item);
        }
        else {
            showItemURL(item);
        }
    }
    else if(item.type == 'category') {
        showCategory(item.requesturl);
    }
    else if(item.type == 'webform') {
        showItemWebform(item.webform);
    }
}
function showItemVideo(item) {
    helpers.navigate({
        moduleName : 'components/homeView/videoView',
        context : {url:item.content}
    });
}
function showItemURL(item) {
    var page = new pagesModule.Page();
    var stackLayout = new StackLayout();
    page.content = stackLayout;
    var titleLabel = new labelModule.Label();
    titleLabel.text = item.title;
    stackLayout.addChild(titleLabel);
    var descLabel = new labelModule.Label();
    descLabel.text = item.description;
    stackLayout.addChild(descLabel);
    var openButton = new buttonModule.Button();
    openButton.text = 'OPEN';
    openButton.on(buttonModule.Button.tapEvent, function (args) {
        showWebView(item.content);
    });
    stackLayout.addChild(openButton);
    var shareButton = new buttonModule.Button();
    shareButton.text = 'SHARE';
    shareButton.on(buttonModule.Button.tapEvent, function (args) {
        sharer.shareText(item.content);
    });
    stackLayout.addChild(shareButton);
    helpers.navigate(function(){return page;});
}

function showWebView(url) {
    var page = new pagesModule.Page();
    var gridLayout = new GridLayout();
    page.content = gridLayout;
    var webView = new webViewModule.WebView();
    webView.url = url;
    gridLayout.addChild(webView);
    helpers.navigate(function(){return page;});
}

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
				if(json.flow) {
					new FlowEngine(json.flow).setItem(item).setWv(wv).execute(function() {});
				
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
	var flow = item.flow;
	if(typeof flow != 'undefined') {
		new FlowEngine(flow).setItem(item).setWv(wv).execute(function() {});
	}
    
    
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
                var flow = item[flowName];
                console.log('HandleEventResponse flow ' + flowName);
                new FlowEngine(flow).setItem(item).setWv(wv).execute(function() {});
            }
        }
    }

    wv.on('loadStarted', _interceptCallsFromWebview)
	
	var ctx = {}; // context object
	ctx.item = item;
	ctx.wv = wv;
	ctx.flows = {};
	
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
	this.flow = util.clone(flow);
	this.canceled = false;
	var vars = {};
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
					setTimeout(done, 1);
				}
			}
			setTimeout(checkNext, 300);
		}
	}
	this.cancel = function() {
		this.canceled = true;
	}
	var replaceAll = function(s, n,v) {
		while(s.indexOf(n) != -1) {
			s = s.replace(n,v);
		}
		return s;
	}
	var replaceVars = function(c) {
		for(var k in vars) {
			c = replaceAll(c, '##' + k + '##', vars[k]);
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
		if(FLOW_ENGINE_CANCELED) {
			return;
		}
		step = replaceVarsStep(step);
		if(step.type == 'setValue') {
			var name = step.name;
			var value = step.value;
			wv.ios.stringByEvaluatingJavaScriptFromString('document.getElementById("' + name + '").value = "' + value + '"');
			setTimeout(next, 1);
		}
		else if(step.type == 'getValue') {
			var name = step.name;
			var value = wv.ios.stringByEvaluatingJavaScriptFromString('document.getElementById("' + name + '").value');
			console.log('getValue ' + name + ' = ' + value)
			vars[step.var] = value;
			setTimeout(next, 1);
		}
		else if(step.type == 'addValue') {
			var name = step.name;
			var value = step.value;
			wv.ios.stringByEvaluatingJavaScriptFromString('document.getElementById("' + name + '").value += "' + value + '"');
			setTimeout(next, 1);
		}
		else if(step.type == 'setHtml') {
			var name = step.name;
			var value = step.value;
			wv.ios.stringByEvaluatingJavaScriptFromString('document.getElementById("' + name + '").innerHTML = "' + value + '"');
			setTimeout(next, 1);
		}
		else if(step.type == 'addHtml') {
			var name = step.name;
			var value = step.value;
			wv.ios.stringByEvaluatingJavaScriptFromString('document.getElementById("' + name + '").innerHTML += "' + value + '"');
			setTimeout(next, 1);
		}
		else if(step.type == 'alert') {
			alert(step.message);
			setTimeout(next, 1);
		}
		else if(step.type == 'openWebView') {
			showWebView(step.url);
			setTimeout(next, 1);
		}
		else if(step.type == 'setclipboard') {
			/*
			var utils = require("utils/utils");
			console.log(1);
			var pasteboard = utils.ios.getter(UIPasteboard, UIPasteboard.generalPasteboard);
		      console.log(2);
		      try {
		      	pasteboard.setValueForPasteboardType(step.message, kUTTypePlainText);
		      } catch (e) {
		      	console.log('some error detected')
		      }
		      
		      console.log(3);
		      */
		      setTimeout(next, 1);
		}
		else if(step.type == 'wait') {
			setTimeout(next, step.timeout);
		}
		else if(step.type == 'requestFlow') {
			step.callbackJSON = function(json) {
				new FlowEngine(json.flow).setItem(item).setWv(wv).execute(next);
			}
			util.frequest(step);
		}
		else if(step.type == 'setVar') {
			vars[step.name] = step.value;
			setTimeout(next, 1);
		}
		else if(step.type == 'evaljs') {
			var val = eval('vars = ' + JSON.stringify(vars) + '; ' + step.code);
			vars[step.var] = val;
			setTimeout(next, 1);
		}
		else if(step.type == 'closewin') {
			helpers.back();
			setTimeout(next, 1);
		}
		else if(step.type == 'webform') {
			showItemWebform(step.webform, {
				refresh:function() {
					if(opts.refresh) opts.refresh();
				}
			});
			setTimeout(next, 1);
		}
		else if(step.type == 'redirectUrl') {
			/*
			showCategoriesItem({
				'name' : step.redirectHeading,
				sublist : []
			}, {url:step.redirectUrl});
*/
			showCategory(step.redirectUrl);
			setTimeout(next, 1);
		}
		else if(step.type == 'if') {
			var val = vars[step.var];
			var validated = false;
			if(step.if == 'contains') {
				validated = val.indexOf(step.pattern) != -1;
			}
			else if(step.if == 'equal') {
				//console.log('execute if [' + val + '] = [' + step.pattern + ']');
				validated = val == step.pattern;
			}
			else if(step.if == 'eq') {
				//console.log('execute if [' + val + '] = [' + step.pattern + ']');
				validated = val == step.pattern;
			}
			else if(step.if == 'neq') {
				//console.log('execute if [' + val + '] = [' + step.pattern + ']');
				validated = val != step.pattern;
			}
			if(validated) {
				if(step.yes_subflow != null) {
					new FlowEngine(step.yes_subflow).setItem(item).setWv(wv).execute(next);
				}
				else {
					setTimeout(next, 1);
				}
			}
			else {
				if(step.no_subflow != null) {
					new FlowEngine(step.no_subflow).setItem(item).setWv(wv).execute(next);	
				}
				else {
					setTimeout(next, 1);
				}
			}
		}
		else if(step.type == 'confirm') {
			var dialog = Ti.UI.createAlertDialog({
				cancel: 1,
				buttonNames: step.buttons,
				message: step.message,
				title: step.title
			  });
			  dialog.addEventListener('click', function(e){
				if(e.index == 0) {
					if(step.yes_subflow != null) {
						new FlowEngine(step.yes_subflow).setItem(item).setWv(wv).execute(next);
					}
					else {
						setTimeout(next, 1);
					}
				}
				else {
					if(step.no_subflow != null) {
						new FlowEngine(step.no_subflow).setItem(item).seWv(wv).execute(next);	
					}
					else {
						setTimeout(next, 1);
					}
				}
			  });
			  dialog.show();
		}
		else {
			// search item if any
			if(typeof item != 'undefined') {
				var flow = item[step.type];
				if(typeof flow != 'undefined') {
					new FlowEngine(flow).setItem(item).seWv(wv).execute(next);
				}
			}
		}
	}
}

