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
		ctx.blobVars = {};
		ctx._logs = [];
		ctx.FLOW_ENGINE_CANCELED_notification_queues = [];
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
			},
			runJS : function(code, next) {
				ctx._testRanCodes.push(code);
				
				if(next) {
					setTimeout(function() {
						if(next.length == 1) {
							if(typeof item._testValue != 'undefined') {
								next(item._testValue);
							}
						}
						else {
							next();
						}
					}, 1);
				}
			},
			runJSSync : function(code, next) {
				ctx._testRanCodes.push(code);
				if(typeof item._testValue != 'undefined') {
					return item._testValue;
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
			assert.equal(ctx.vars["apple"],"test");
			assert.equal(ctx.vars["result"],"test test");
			assert.equal(ctx._vars["orange"],"test2");
			assert.equal(ctx.vars["result2"],"test2 test2");
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
			assert.equal(ctx.vars["apple"], "test");
			assert.equal(ctx.vars["result"],"test test");
			assert.equal(ctx.vars["subResult"],"test3 test4 test5");
			assert.equal(ctx.vars["subResult1"],"test6");
			assert.equal(ctx.vars["subResult2"],"test7");
			assert.equal(ctx.vars["subResult3"],"test7");
			assert.equal(ctx.vars["result2"],"##someInput2##");
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
			assert.equal(ctx.vars["result1"],1);
			assert.equal(ctx.vars["result2"],2);
			assert.equal(ctx.vars["result3"],3);
			assert.equal(ctx.vars["result4"],4);
			assert.equal(ctx.vars["resultB1"],1);
			assert.equal(ctx.vars["resultB2"],2);
			assert.equal(ctx.vars["resultB3"],3);
			assert.equal(ctx.vars["resultB4"],4);
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
			assert.equal(ctx.vars["result"],'1 ##type## ##start## ##end## ##step## ##array## ##flow## a 1');
			assert.equal(ctx.vars["result2"],'1 ##type## ##start## ##end## ##step## ##array## ##flow## a 1');
			assert.equal(ctx.vars["result3"],'1 ##type## ##start## ##end## ##step## ##array## ##flow## ##input1## ##input2##');
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
			assert.equal(ctx._testRanCodes.length, 1);
			assert.equal(ctx._testRanCodes[0],'document.getElementById("box").style.backgroundColor = "red"');
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
			assert.equal(ctx._testRanCodes.length, 2);
			assert.equal(ctx._testRanCodes[0], 'document.getElementById("box2").style.backgroundColor = "red"');
			assert.equal(ctx._testRanCodes[1], 'document.getElementById("box2").style.borderColor = "green"');
			done();
		});
    });
  });
  describe('#getCSS', function() {
	it('should able to get css style', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'getCSS',name:'box',style:'backgroundColor',result:'result'},
				]
			}
		};
		webform._testValue = 'red';
		executeWebform(webform, function(ctx) {
			assert.equal(ctx._testRanCodes.length, 1);
			assert.equal(ctx._testRanCodes[0],'document.getElementById("box").style.backgroundColor');
			assert.equal(ctx.vars['result'],'red');
			done();
		});
    });
  });
  describe('#setValue', function() {
	it('should able to set value', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setValue',name:'box',value:'result'},
				]
			}
		};
		executeWebform(webform, function(ctx) {
			assert.equal(ctx._testRanCodes.length,1);
			assert.equal(ctx._testRanCodes[0],'document.getElementById("box").value = "result"');
			done();
		});
    });
  });
  describe('#getValue', function() {
	it('should able to get value', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'getValue',name:'box',var:'result'},
				]
			}
		};
		webform._testValue = 'testval';
		executeWebform(webform, function(ctx) {
			assert.equal(ctx._testRanCodes.length,1);
			assert.equal(ctx._testRanCodes[0],'document.getElementById("box").value');
			assert.equal(ctx.vars['result'],'testval');
			done();
		});
    });
  });
  describe('#setHtml', function() {
	it('should able to set html', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setHtml',name:'box',value:'result'},
				]
			}
		};
		executeWebform(webform, function(ctx) {
			assert.equal(ctx._testRanCodes.length,1);
			assert.equal(ctx._testRanCodes[0],'document.getElementById("box").innerHTML = "result"');
			done();
		});
    });
  });
  describe('#addHtml', function() {
	it('should able to add html', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'addHtml',name:'box',value:'result'},
				]
			}
		};
		executeWebform(webform, function(ctx) {
			assert.equal(ctx._testRanCodes.length,1);
			assert.equal(ctx._testRanCodes[0],'document.getElementById("box").innerHTML += "result"');
			done();
		});
    });
  });
  describe('#addValue', function() {
	it('should able to add value', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'addValue',name:'box',value:'result'},
				]
			}
		};
		executeWebform(webform, function(ctx) {
			assert.equal(ctx._testRanCodes.length,1);
			assert.equal(ctx._testRanCodes[0],'document.getElementById("box").value += "result"');
			done();
		});
    });
  });

  describe('#show', function() {
	it('should able to show component', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'show',name:'box'},
				]
			}
		};
		executeWebform(webform, function(ctx) {
			assert.equal(ctx._testRanCodes.length,1);
			assert.equal(ctx._testRanCodes[0],'document.getElementById("box").style.visibility = "visible"');
			done();
		});
    });
  });
  describe('#hide', function() {
	it('should able to hide component', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'hide',name:'box'},
				]
			}
		};
		executeWebform(webform, function(ctx) {
			assert.equal(ctx._testRanCodes.length,1);
			assert.equal(ctx._testRanCodes[0],'document.getElementById("box").style.visibility = "hidden"');
			done();
		});
    });
  });
  describe('#openWebView', function() {
	it('should able to open web view', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'openWebView',url:'http://www.google.com'},
				]
			}
		};
		
		executeWebform(webform, function(ctx) {
			assert.equal(ctx._urls.length,1);
			assert.equal(ctx._urls[0],'http://www.google.com');
			done();
		});
    });
  });
  describe('#redirectUrl', function() {
	it('should able to redirect url', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'redirectUrl',redirectUrl:'http://www.google.com'},
				]
			}
		};
		
		executeWebform(webform, function(ctx) {
			assert.equal(ctx._urls.length,1);
			assert.equal(ctx._urls[0],'http://www.google.com');
			done();
		});
    });
  });
  describe('#waitUntil', function() {
	var globalTimeout = 300;
	it('should able to wait until with success', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'a',value:1},
					{type:'asyncFlow',flow:'subflow',delay:1},
					{type:'waitUntil',var:'a',value:2}
				]
			},
			flows : {
				subflow: {
					steps : [
						{type:'setVar',name:'a',value:2},
					]
				}
			}
		};
		var startTime = new Date().getTime();
		executeWebform(webform, function(ctx) {
			var endTime = new Date().getTime();
			assert.equal(endTime - startTime < globalTimeout, true);
			done();
		});
    });
	it('should able to wait until with fail timeout', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'a',value:1},
					{type:'asyncFlow',flow:'subflow'},
					{type:'waitUntil',var:'a',value:2,timeout:globalTimeout}
				]
			},
			flows : {
				subflow: {
					steps : [
						{type:'setVar',name:'a',value:3},
					]
				}
			}
		};
		var startTime = new Date().getTime();
		executeWebform(webform, function(ctx) {
			var endTime = new Date().getTime();
			assert.equal(endTime - startTime >= globalTimeout, true);
			done();
		});
    });
	var buildTestCase = function(tc, a,b,c,d,e,f) {
		it(tc, function(done) {
			var webform = {
				heading:'test form',
				params: [],
				flow : {
					steps: [
						{type:'setVar',name:'result',value:false},
						{type:'setVar',name:'a',value:a},
						{type:'asyncFlow',flow:'subflow'},
						{type:'waitUntil',var:'a',value:b,on_success:'success_flow',on_fail:'fail_flow',timeout:globalTimeout}
					]
				},
				flows : {
					subflow: {
						steps : [
							{type:'setVar',name:'a',value:c},
						]
					},
					success_flow: {
						steps : [
							{type:'setVar',name:'result',value:d},
						]
					},
					fail_flow: {
						steps : [
							{type:'setVar',name:'result',value:!d},
						]
					}
				}
			};
			var startTime = new Date().getTime();
			executeWebform(webform, function(ctx) {
				var endTime = new Date().getTime();
				assert.equal(endTime - startTime < globalTimeout, d);
				assert.equal(ctx.vars['result'], true);
				done();
			});
		});
	}
	buildTestCase('should able to call on_success when success',1,2,2,true);
	buildTestCase('should able to call on_fail when fail',1,2,3,false);
	buildTestCase('should able to call on_success when success with boolean',false,true,true,true);
	buildTestCase('should able to call on_fail when fail with boolean',false,true,false,false);
	buildTestCase('should able to call on_success when success with string','fff','ttt','ttt',true);
	buildTestCase('should able to call on_fail when fail with string','fff','ttt','fff',false);
	it('should fail when tick larger than timeout although it could be success', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'result',value:false},
					{type:'setVar',name:'a',value:1},
					{type:'asyncFlow',flow:'subflow'},
					{type:'waitUntil',var:'a',value:2,on_success:'success_flow',on_fail:'fail_flow',timeout:globalTimeout,tick:globalTimeout + 50}
				]
			},
			flows : {
				subflow: {
					steps : [
						{type:'setVar',name:'a',value:2},
					]
				},
				success_flow: {
					steps : [
						{type:'setVar',name:'result',value:true},
					]
				},
				fail_flow: {
					steps : [
						{type:'setVar',name:'result',value:false},
					]
				}
			}
		};
		executeWebform(webform, function(ctx) {
			assert.equal(ctx.vars['result'],false);
			done();
		});
    });
	
	it('should able to wait until with success from sub async-ed flow', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'asyncFlow',flow:'submain'},
					{type:'waitUntil',var:'a',value:3},
				]
			},
			flows : {
				submain: {
					steps: [
						{type:'setVar',name:'a',value:1},
						{type:'asyncFlow',flow:'subflow',delay:1},
						{type:'waitUntil',var:'a',value:2},
						{type:'setVar',name:'a',value:3},
						// #187 waitUntil success when a variable value changed from 1 to 2 then after that change to 1, test few scenarios on tick time, and the time between changing value
						//{type:'wait',timeout:1000},
						//{type:'setVar',name:'a',value:2}
					]
				},
				subflow: {
					steps : [
						{type:'setVar',name:'a',value:2},
					]
				}
			}
		};
		var startTime = new Date().getTime();
		executeWebform(webform, function(ctx) {
			var endTime = new Date().getTime();
			assert.equal(endTime - startTime < globalTimeout, true);
			done();
		});
    });
	
	
  });
  describe('#evaljs', function() {
	it('should able to evaljs', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'apple',value:'a'},
					{type:'setVar',name:'boy',value:'b'},
					{type:'evaljs',var:'result',code:'vars["apple"] + vars["boy"]'},
					{type:'evaljs',var:'result2',code:'return vars["apple"] + vars["boy"] + "c"'},
					{type:'evaljs',code:'vars["car"] = "3"'},
				]
			}
		};
		
		executeWebform(webform, function(ctx) {
			assert.equal(ctx.vars["result"], "ab");
			assert.equal(ctx.vars["result2"], "abc");
			assert.equal(ctx.vars["car"], "3");
			done();
		});
    });
	it('should able to evaljs 2', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'evaljs',var:'result',code:'b=1;c=3;return b+c'},
				]
			}
		};
		
		executeWebform(webform, function(ctx) {
			done();
		});
    });
  });
  describe('#crypto', function() {
	it('should able to encrypt and decrypt', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'apple',value:'1QW@#$%^&*(_+{}|:">?<MNBVXZ,./;;[]\=-09865lskfhkre hk'},
					{type:'crypto', action:'encrypt', plaintext:'apple',ciphered:'c'},
					{type:'crypto', action:'decrypt', ciphertext:'c', deciphered:'d'}
				]
			}
		};
		
		executeWebform(webform, function(ctx) {
			assert.equal(ctx.vars['d'], '1QW@#$%^&*(_+{}|:">?<MNBVXZ,./;;[]\=-09865lskfhkre hk');
			done();
		});
    }); // end it
	it('should able to encrypt and decrypt with custom password', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'myPassword',value:'1l231l23l1k23j1l2k3'},
					{type:'setVar',name:'apple',value:'1QW@#$%^&*(_+{}|:">?<MNBVXZ,./;;[]\=-09865lskfhkre hk'},
					{type:'crypto', action:'encrypt', plaintext:'apple',ciphered:'c',password:'myPassword'},
					{type:'crypto', action:'decrypt', ciphertext:'c', deciphered:'d',password:'myPassword'},
					{type:'crypto', action:'encrypt', plaintext:'apple',ciphered:'e'},
					{type:'crypto', action:'decrypt', ciphertext:'e', deciphered:'f'},
					{type:'crypto', action:'decrypt', ciphertext:'e', deciphered:'g',password:'myPassword'}
				]
			}
		};
		
		executeWebform(webform, function(ctx) {
			assert.equal(ctx.vars['d'], '1QW@#$%^&*(_+{}|:">?<MNBVXZ,./;;[]\=-09865lskfhkre hk');
			assert.equal(ctx.vars['f'], '1QW@#$%^&*(_+{}|:">?<MNBVXZ,./;;[]\=-09865lskfhkre hk');
			assert.notEqual(ctx.vars['g'], '1QW@#$%^&*(_+{}|:">?<MNBVXZ,./;;[]\=-09865lskfhkre hk');
			done();
		});
    }); // end it
  });
  describe('#evaluate inline code (evalParser)', function() {
	it('should able to evaluate inline code', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'apple',value:'a'},
					{type:'setVar',name:'boy',value:'b'},
					{type:'setVar',name:'car',value:'this is {{apple}} and {{boy}}'},
					{type:'setVar',name:'dog',value:[{name:'apple',age:12},{name:'boy',age:45}]},
					{type:'setVar',name:'ele',value:'name {{dog[0].name}} and {{dog[0].age}}'},
					{type:'runLoop',flow:'subFlow',array:'dog'},
					{type:'setVar',name:'cond',value:'1'},
					{type:'{{cond == 1 ? "FlowOne" : "FlowTwo"}}'},
					{type:'setVar',name:'cond',value:'2'},
					{type:'{{cond == 1 ? "FlowOne" : "FlowTwo"}}'},
				]
			}
			,
			flows : {
				subFlow : {
					steps : [
						{type:'setVar',name:'subFlowResult',value:'{{item.name}} and {{item.age}}'},
					]
				},
				FlowOne : {
					steps : [
						{type:'setVar',name:'FlowOneResult',value:'1'},
					]
				},
				FlowTwo : {
					steps : [
						{type:'setVar',name:'FlowTwoResult',value:'2'},
					]
				}
			}
		};
		
		executeWebform(webform, function(ctx) {
			assert.equal(ctx.vars["car"], "this is a and b");
			assert.equal(ctx.vars["ele"], "name apple and 12");
			assert.equal(ctx.vars["subFlowResult"], "boy and 45");
			assert.equal(ctx.vars["FlowOneResult"], "1");
			assert.equal(ctx.vars["FlowTwoResult"], "2");
			done();
		});
    });
	it('should able to evaluate variable expression into inline code expression', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'apple',value:'a'},
					{type:'setVar',name:'boy',value:'b'},
					{type:'setVar',name:'car',value:'this is {{apple+"##boy##"}} and {{boy+"##apple##"}}'},
				]
			}
		};
		
		executeWebform(webform, function(ctx) {
			assert.equal(ctx.vars["car"], "this is ab and ba");
			done();
		});
    });
  });
});