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

function showItemNSPage(itemPage) {
	var page = new pagesModule.Page();
	itemPage.comp = page;
	processComponents(itemPage);
	helpers.navigate(function(){return page;});
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
	itemPage.comp.childs = [];
	if(itemPage.childs.length) {
		itemPage.childs.forEach(function(child) {
			processType(child);
			itemPage.comp.childs.push(child.comp);
		});
	}
}

/*## PROCESS TYPE ##*/
function processType(c) {
	var dec = require('./components/' + c.type + '.js');
	dec.process(c);
	processParamIntoComp(c);
	processTapable(dec, c);
	processComponents(c);
}
function processParamIntoComp(c) {
	for(var key in c) {
		if(key == 'comp') continue;
		if(key == 'flow') continue;
		if(typeof c.comp[key] == 'undefined') {
			c.comp.key = c[key];
		}
	}
}
function processTapable(dec, c) {
	if(dec.tapable) {
		c.comp.on(buttonModule.Button.tapEvent, function (args) {
			// Execute flow
			// FLOW - start
			var ctx = {}; // context object
			ctx.c = c;
			ctx.wv = wv;
			ctx.flows = {};
			ctx.vars = {};
			ctx.blobVars = {};
			ctx._logs = [];
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
			ctx.showItemWebform = modWebform.showItemWebform;
			ctx.showCategory = _funcs['showCategory'];
			ctx.showWebView = _funcs['showWebView'];
			ctx.showCategoryItems = _funcs['showCategoryItems'];
			ctx.showListChooser = _funcs['showListChooser'];
			
			// #47 iterate all webform level flows and put into context flow collection
			if(typeof c.flows != 'undefined') {
				for(var i in c.flows) {
					ctx.flows[i] = c.flows[i];
				}
			}
			
			var flow = c.flow;
			// #47 FlowEngine webform level
			ctx.createFlowEngine(flow).execute(function() {});
			
			c.comp.parentPage.addEventListener(pagesModule.Page.navigatedFromEvent, function(evt) {
				modFlow.FLOW_ENGINE_CANCELED = true;
				ctx.enable_FLOW_ENGINE_CANCELLED();
				console.log('FLOW engine canceled')
			})
			
		    // FLOW - end
		});
	}
}
module.exports.showItemNSPage = showItemNSPage;
var _funcs = {};
module.exports.setFunc = function(name, func) {
	_funcs[name] = func;
}