var path = require('path');
var assert = require('assert');
global.ProjRequire = function(module) {
	return require(path.join(__dirname, '/../' + module)); 
}

describe('modFlow', function() {
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
		ctx.showCategory = function() {}
		ctx.showWebView = function() {}
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
  
	
  describe('#setVar', function() {
	it('should able to setVar', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'apple',value:'test'},
					{type:'setVar',name:'result',value:'test ##apple##'},
					{type:'setVar',name:'orange',value:'test2',local:1},
					{type:'setVar',name:'result2',value:'test2 ##orange##'},
				]
			}
		};
		executeWebform(webform, function(ctx) {
			assert.equal("test", ctx.vars["apple"]);
			assert.equal("test test", ctx.vars["result"]);
			assert.equal("test2", ctx._vars["orange"]);
			assert.equal("test2 test2", ctx.vars["result2"]);
			done();
		});
    });
  });
  
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
					{type:'subflowA',someInput2:'test5'}
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
			done();
		});
    });
  });
  
  describe('#runLoop', function() {
	it('should able to runLoop with array', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'apple',value:1},
					{type:'setVar',name:'array',value:[1,2,3,4]},
					{type:'setVar',name:'blankArray',value:[]},
					{type:'runLoop',array:'array',flow:'subflowA'},
					{type:'runLoop',array:'array',flow:'subflowB',item:'myItem'},
					{type:'runLoop',array:'blankArray',flow:'subflowA'}
				]
			},
			flows : {
				subflowA : {
					steps: [
						{type:'setVar',name:'result##item##',value:'##item##'},
					]
				},
				subflowB : {
					steps: [
						{type:'setVar',name:'resultB##myItem##',value:'##myItem##'},
					]
				}
			}
		};
		executeWebform(webform, function(ctx) {
			assert.equal(1, ctx.vars["result1"]);
			assert.equal(2, ctx.vars["result2"]);
			assert.equal(3, ctx.vars["result3"]);
			assert.equal(4, ctx.vars["result4"]);
			assert.equal(1, ctx.vars["resultB1"]);
			assert.equal(2, ctx.vars["resultB2"]);
			assert.equal(3, ctx.vars["resultB3"]);
			assert.equal(4, ctx.vars["resultB4"]);
			done();
		});
    });
	
	it('should able to runLoop with start end step', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'apple',value:1},
					{type:'setVar',name:'result',value:''},
					{type:'setVar',name:'result2',value:''},
					{type:'runLoop',start:0,end:4,step:1,flow:'subflowA'},
					{type:'runLoop',end:4,flow:'subflowB'},
				]
			},
			flows : {
				subflowA : {
					steps: [
						{type:'setVar',name:'result',value:'##result####apple##'},
					]
				},
				subflowB : {
					steps: [
						{type:'setVar',name:'result2',value:'##result2####apple##'},
					]
				}
			}
		};
		executeWebform(webform, function(ctx) {
			assert.equal('1111', ctx.vars["result"]);
			assert.equal('1111', ctx.vars["result2"]);
			done();
		});
    });
	it('should able to bypass runLoop without defined start end step or array', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'apple',value:1},
					{type:'setVar',name:'result',value:''},
					{type:'runLoop',flow:'subflowA'}
				]
			},
			flows : {
				subflowA : {
					steps: [
						{type:'setVar',name:'result',value:'##result####apple##'},
					]
				}
			}
		};
		executeWebform(webform, function(ctx) {
			done();
		});
    });
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
			done();
		});
    });
  });
  
  describe('#setCSS', function() {
	it('should able to set css style for single style and value', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setCSS',name:'box',style:'backgroundColor',value:'red'},
				]
			}
		};
		executeWebform(webform, function(ctx) {
			assert.equal(1, ctx._testRanCodes.length);
			assert.equal('document.getElementById("box").style.backgroundColor = "red"', ctx._testRanCodes[0]);
			done();
		});
    });
	it('should able to set css style for multiple style and value', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setCSS',name:'box2',styles:{ 'backgroundColor':'red','borderColor':'green'}}
				]
			}
		};
		executeWebform(webform, function(ctx) {
			assert.equal(2, ctx._testRanCodes.length);
			assert.equal('document.getElementById("box2").style.backgroundColor = "red"', ctx._testRanCodes[0]);
			assert.equal('document.getElementById("box2").style.borderColor = "green"', ctx._testRanCodes[1]);
			done();
		});
    });
  });
});