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

function onPageLoaded(args) {
    console.log("Page Loaded");
    var page = args.object;
    var data = page.navigationContext;
    var url = data.url;
    showCategory(url);
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
    			html += '<span>' + param.name + '</span>';
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
			}
		});
    });
    gridLayout.addChild(submitBtn);
    
    helpers.navigate(function(){return page;});
}
exports.onPageLoaded = onPageLoaded;