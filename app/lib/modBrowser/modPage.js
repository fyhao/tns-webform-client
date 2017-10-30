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
var modWebform = require('./modWebform.js');
var propParser = require('./helperPropParser.js');
function showItemNSPage(itemPage) {
	//console.log('showItemNSPage: ' + JSON.stringify(itemPage));
	var page = new pagesModule.Page();
	if(itemPage.css) {
		page.addCss(itemPage.css);
	}
	itemPage.comp = page;
	processComponents(itemPage);
	helpers.navigate(function(){return page;});
	ctx.itemPage = itemPage;
	ctx.showItemWebform = modWebform.showItemWebform;
	ctx.showCategory = _funcs['showCategory'];
	ctx.showWebView = _funcs['showWebView'];
	ctx.showCategoryItems = _funcs['showCategoryItems'];
	ctx.showListChooser = _funcs['showListChooser'];
	ctx.showItemNSPage = _funcs['showItemNSPage'];
	if(typeof itemPage.flows != 'undefined') {
		for(var i in itemPage.flows) {
			ctx.flows[i] = itemPage.flows[i];
		}
	}
	if(typeof itemPage.pages != 'undefined') {
		for(var i in itemPage.pages) {
			ctx.pages[i] = itemPage.pages[i];
		}
	}
	if(typeof itemPage.webforms != 'undefined') {
		for(var i in itemPage.webforms) {
			ctx.webforms[i] = itemPage.webforms[i];
		}
	}
	if(typeof item.props != 'undefined') {
		for(var i in item.props) {
			ctx.props[i] = item.props[i];
		}
	}
	var flow = itemPage.flow;
	ctx.createFlowEngine(flow).execute(function() {});

	page.addEventListener(pagesModule.Page.navigatedFromEvent, function(evt) {
		//modFlow.FLOW_ENGINE_CANCELED = true;
		//ctx.enable_FLOW_ENGINE_CANCELLED();
		//console.log('FLOW engine canceled FROM showItemNSPage')
	})
	
}
function processComponents(itemPage) {
	if(itemPage.content) {
		processContent(itemPage);
	}
	if(itemPage.childs) {
		processChilds(itemPage);
	}
}

function processContent(itemPage) {
	processType(itemPage.content);
	itemPage.comp.content = itemPage.content.comp;
}
function processChilds(itemPage) {
	if(itemPage.childs.length) {
		itemPage.childs.forEach(function(child) {
			processType(child);
			itemPage.comp.addChild(child.comp);
		});
	}
}

/*## PROCESS TYPE ##*/
function processType(c) {
	//console.log("DEBUG processType: " + JSON.stringify(c));
	c.processType = processType;
	c.ctx = ctx;
	var dec = require('./components/' + c.type + '.js');
	dec.process(c);
	for(var i in c) {
		if(typeof c[i] == 'string') {
			c[i] = propParser.parse(ctx, c[i]);
		}
	}
	processParamIntoComp(c);
	processTapable(dec, c);
	processComponents(c);
	if(dec.postComponentProcess) dec.postComponentProcess(c);
}
function processParamIntoComp(c) {
	for(var key in c) {
		if(key == 'comp') continue;
		if(key == 'flow') continue;
		if(typeof c.comp[key] == 'undefined') {
			c.comp[key] = c[key];
		}
	}
}
function processTapable(dec, c) {
	if(dec.tapable) {
		c.comp.on(buttonModule.Button.tapEvent, function (args) {
			var flow = c.tap;
			ctx.createFlowEngine(flow).execute(function() {});
		});
	}
}

var _funcs = {};

// Execute flow
// FLOW - start
var ctx = {}; // context object

ctx.flows = {};
ctx.webforms = {};
ctx.pages = {};
ctx.vars = {};
ctx.blobVars = {};
ctx._logs = [];
ctx.props = {};
ctx.FLOW_ENGINE_CANCELED_notification_queues = [];
ctx.enable_FLOW_ENGINE_CANCELLED = function() {
	var queues = ctx.FLOW_ENGINE_CANCELED_notification_queues;
	if(queues && queues.length) {
		for(var i = 0; i < queues.length; i++) {
			queues[i]();
		}
	}
}
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



// FLOW - end


module.exports.showItemNSPage = showItemNSPage;

module.exports.setFunc = function(name, func) {
	_funcs[name] = func;
}