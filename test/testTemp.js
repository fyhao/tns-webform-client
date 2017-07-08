var path = require('path');
var assert = require('assert');
global.ProjRequire = function(module) {
	return require(path.join(__dirname, '/../' + module)); 
}

describe('test', function() {
  this.timeout(15000);
  var modFlow = ProjRequire('app/lib/modBrowser/modFlow.js');
  var executeWebform = function(item,done) {
	    var ctx = {}; // context object
		ctx.item = item;
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
		ctx.showItemWebform = function() {}
		//ctx.showCategory = function() {}
		//ctx.showWebView = function() {}
		// start simulation
		ctx._testRanCodes = [];
		ctx.wv = {
			ios : {
				stringByEvaluatingJavaScriptFromString : function(code) {
					ctx._testRanCodes.push(code);
					if(typeof item._testValue != 'undefined') {
						return item._testValue;
					}
				}
			}
		};
		ctx._urls = [];
		ctx.showWebView = function(url) {
			ctx._urls.push(url);
		}
		ctx.showCategory = function(url) {
			ctx._urls.push(url);
		}
		// end simulation

		// #47 iterate all webform level flows and put into context flow collection
		if(typeof item.flows != 'undefined') {
			for(var i in item.flows) {
				ctx.flows[i] = item.flows[i];
			}
		}

		var flow = item.flow;
		// #47 FlowEngine webform level
		ctx.createFlowEngine(flow).execute(function() {
			done(ctx);
		});
  }
  describe('#subflow', function() {
	it('should able to call subflows', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'apple',value:'test'},
					{type:'setVar',name:'result',value:'test ##apple##'},
					{type:'setVar',name:'someInput',value:'test4'},
					{type:'setVar',name:'globalVar',value:'test6'},
					{type:'subflowA',someInput2:'test5'},
					{type:'setVar',name:'result2',value:'##someInput2##'},
				]
			},
			flows : {
				subflowA : {
					steps: [
						{type:'setVar',name:'subResult',value:'test3 ##someInput## ##someInput2##'},
						{type:'setVar',name:'subResult1',value:'##globalVar##'},
						{type:'setVar',name:'globalVar',value:'test7',local:1},
						{type:'setVar',name:'subResult2',value:'##globalVar##'},
						{type:'setVar',name:'globalVar',value:'test8'},
						{type:'setVar',name:'subResult3',value:'##globalVar##'},
					]
				}
			}
		};
		executeWebform(webform, function(ctx) {
			assert.equal("test", ctx.vars["apple"]);
			assert.equal("test test", ctx.vars["result"]);
			assert.equal("test3 test4 test5", ctx.vars["subResult"]);
			assert.equal("test6", ctx.vars["subResult1"]);
			assert.equal("test7", ctx.vars["subResult2"]);
			assert.equal("test7", ctx.vars["subResult3"]);
			assert.equal("##someInput2##", ctx.vars["result2"]);
			done();
		});
    });
  });
  
  describe('#runLoop', function() {
	
	it('should able to runLoop with valid inputVars', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'apple',value:1},
					{type:'runLoop',flow:'subflowA',start:0,end:4,step:1,input1:'a',input2:'##apple##'},
					{type:'setVar',name:'array1',value:[1,2,3,4]},
					{type:'runLoop',flow:'subflowB',array:'array1',input1:'a',input2:'##apple##'},
					{type:'setVar',name:'result3',value:'##apple## ##type## ##start## ##end## ##step## ##array## ##flow## ##input1## ##input2##'},
				]
			},
			flows : {
				subflowA : {
					steps: [
						{type:'setVar',name:'result',value:'##apple## ##type## ##start## ##end## ##step## ##array## ##flow## ##input1## ##input2##'},
					]
				},
				subflowB : {
					steps: [
						{type:'setVar',name:'result2',value:'##apple## ##type## ##start## ##end## ##step## ##array## ##flow## ##input1## ##input2##'},
					]
				}
			}
		};
		executeWebform(webform, function(ctx) {
			assert.equal('1 ##type## ##start## ##end## ##step## ##array## ##flow## a 1', ctx.vars["result"]);
			assert.equal('1 ##type## ##start## ##end## ##step## ##array## ##flow## a 1', ctx.vars["result2"]);
			assert.equal('1 ##type## ##start## ##end## ##step## ##array## ##flow## ##input1## ##input2##', ctx.vars["result3"]);
			done();
		});
    });
  });
});