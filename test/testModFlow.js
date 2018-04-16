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
		ctx.webforms = {};
		ctx.pages = {};
		ctx.vars = {};
		ctx.blobVars = {};
		ctx._logs = [];
		ctx.props = {};
		ctx.FLOW_ENGINE_CANCELED_notification_queues = [];
		var TimerManager = ProjRequire('app/utils/timermgr.js');
		ctx.timermgr = new TimerManager();
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
		
		if(typeof item.props != 'undefined') {
			for(var i in item.props) {
				ctx.props[i] = item.props[i];
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
  describe('#dummy', function() {
	it('should able to perform dummy flow', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'dummy'}
				]
			}
		};
		executeWebform(webform, function(ctx) {
			done();
		});
    });
  });
  describe('#blank flow', function() {
	it('should able to bypass flow for zero steps', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					
				]
			}
		};
		executeWebform(webform, function(ctx) {
			done();
		});
    });
	it('should able to bypass flow if steps not defined', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				
			}
		};
		executeWebform(webform, function(ctx) {
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
	it('should able to evaljs to ctx.createFlowEngine within timeout', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'result',value:'1'},
					{type:'evaljs',code:'ctx.createFlowEngine("show_option").execute(next);',timeout:10},
				]
			}
			,
			flows : {
				show_option : {
					steps : [
						{type:'setVar',name:'result',value:'2'}
					]
				}
			}
		};
		
		executeWebform(webform, function(ctx) {
			assert.equal(ctx.vars["result"], "2");
			done();
		});
    });
	it('should able to evaljs to ctx.createFlowEngine bypassed if not within timeout', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'result',value:'1'},
					{type:'evaljs',code:'ctx.createFlowEngine("show_option").execute(function() {});',timeout:10},
				]
			}
			,
			flows : {
				show_option : {
					steps : [
						{type:'setVar',name:'result',value:'2'}
					]
				}
			}
		};
		
		executeWebform(webform, function(ctx) {
			assert.equal(ctx.vars["result"], "2");
			done();
		});
    });
	it('should able to evaljs to use MyUtil function', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'result',value:'abc'},
					{type:'evaljs',code:'return util.replaceAll(vars.result,"b","d")',var:'result2'},
				]
			}
		};
		
		executeWebform(webform, function(ctx) {
			assert.equal(ctx.vars["result2"], "adc");
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
					{type:'crypto', action:'decrypt', ciphertext:'e', deciphered:'g',password:'myPassword'},
					{type:'crypto', action:'testNotExist', ciphertext:'e', deciphered:'g',password:'myPassword'}
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
					{type:'setVar',name:'FlowOneResult',value:''},
					{type:'setVar',name:'FlowTwoResult',value:''},
					{type:'setVar',name:'cond',value:'2'},
					{type:'{{cond == 1 ? "FlowOne" : "FlowTwo"}}'},
					{type:'setVar',name:'cond',value:'1'},
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
						{type:'setVar',name:'FlowOneResult',value:'{{FlowOneResult}}{{FlowTwoResult}}a'},
					]
				},
				FlowTwo : {
					steps : [
						{type:'setVar',name:'FlowTwoResult',value:'{{FlowOneResult}}{{FlowTwoResult}}b'},
					]
				}
			}
		};
		
		executeWebform(webform, function(ctx) {
			assert.equal(ctx.vars["car"], "this is a and b");
			assert.equal(ctx.vars["ele"], "name apple and 12");
			assert.equal(ctx.vars["subFlowResult"], "boy and 45");
			assert.equal(ctx.vars["FlowOneResult"], "ba");
			assert.equal(ctx.vars["FlowTwoResult"], "b");
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
	it('should able to evaluate subflow inputvars for inline JS expression', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'apple',value:'a'},
					{type:'subFlow',someInput:'b'},
					{type:'setVar',name:'apple',value:'a'},
				]
			},
			flows : {
				subFlow : {
					steps : [
						{type:'setVar',name:'subFlowResult',value:'{{someInput}}'},
					]
				}
			}
		};
		
		executeWebform(webform, function(ctx) {
			assert.equal(ctx.vars["subFlowResult"], "b");
			done();
		});
    });
  });
  
  describe('#evaluate property %%prop:xxx%%', function() {
	it('should able to evaluate property for workflows steps', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'apple',value:'%%prop:_apple%%'},
					{type:'setVar',name:'bat',value:'%%prop:_bat%%'},
					{type:'setVar',name:'car',value:'%%prop:_car%%'},
					{type:'setVar',name:'dog',value:'%%prop:_dog%%'},
					{type:'setVar',name:'result',value:'{{dog.type}}-{{dog.params.length}}'}
				]
			}
			,
			props : {
				_apple : 'value_apple_value',
				_bat : 3,
				_car : true,
				_dog : {type:'webform',params:[]}
			}
		};
		
		executeWebform(webform, function(ctx) {
			assert.equal(ctx.vars["apple"], "value_apple_value");
			assert.equal(ctx.vars["bat"], 3);
			assert.equal(ctx.vars["car"], true);
			assert.equal(ctx.vars["result"], 'webform-0');
			done();
		});
    }); // end it
	it('should able to evaluate property of a property', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'apple',value:'%%prop:_apple%%'},
					{type:'setVar',name:'car',value:'%%prop:_car%%'},
					{type:'setVar',name:'resultcar',value:'{{car._dog}}'},
					{type:'setVar',name:'resultele',value:'{{car._ele.horse}}-{{car._ele.cat}}-{{car._ele.mon}}-{{car._ele.nan}}-{{car._ele.orange}}'},
				]
			}
			,
			props : {
				_apple : '%%prop:_bat%%',
				_bat : 'bat',
				_car : {
					_dog : '%%prop:_apple%%',
					_ele : '%%prop:_fish%%'
				},
				_fish : {
					horse : '%%prop:_apple%%',
					cat : 'cat123',
					mon : '%%prop%%',
					nan : '%%test:test%%',
					orange : '%%prop:_notexist%%'
				}
			}
		};
		
		executeWebform(webform, function(ctx) {
			assert.equal(ctx.vars["apple"], "bat");
			assert.equal(ctx.vars["resultcar"], "bat");
			assert.equal(ctx.vars["resultele"], "bat-cat123-%%prop%%-%%test:test%%-%%prop:_notexist%%");
			done();
		});
    }); // end it
  });
  
  
  describe('#asyncFlow to support requestFlow', function() {
	it('should able to call requestFlow within asyncFlow', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'debug',value:'1'},
					{type:'asyncFlow',flow:'asyncRequestFlow'},
					{type:'setVar',name:'debug',value:'2'},
					{type:'waitUntil',var:'debug',value:'5'},
					{type:'downloadedFlow'}	
				]
			},
			flows : {
				asyncRequestFlow: {
					steps : [
						{type:'setVar',name:'debug',value:'3'},
						{type:'requestFlow',url:''},
						{type:'waitUntil',var:'debug',value:'4'},
						{type:'setVar',name:'debug',value:'5'},
					]
				}
			}
		};
		var mock = require('mock-require');
		 
		mock('../app/utils/MyUtil', { frequest: function(opts) {
		  console.log('mock http.request called');
		  // simulate json response in frequest
		  opts.callbackJSON({
			  flows : {
				  downloadedFlow : {
					  steps : [
						{type:'setVar',name:'debug',value:'6'},
					  ]
				  }
			  },
			  flow : {
				  steps : [
					{type:'setVar',name:'debug',value:'4'},
				  ]
			  }
		  });
		}});
		  
		mock('../app/utils/nativeActivityIndicator', { enableActivityIndicator: function() {
		  console.log('mock enableActivityIndicator called');
		},disableActivityIndicator: function() {
		  console.log('mock disableActivityIndicator called');
		}});
		executeWebform(webform, function(ctx) {
			assert.equal(ctx.vars["debug"], "6");
			done();
		});
    }); // end it
	
	it('should able to call requestFlow within asyncFlow with flow only', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'debug',value:'1'},
					{type:'asyncFlow',flow:'asyncRequestFlow'},
					{type:'setVar',name:'debug',value:'2'},
					{type:'waitUntil',var:'debug',value:'5'},
					{type:'downloadedFlow'}	
				]
			},
			flows : {
				asyncRequestFlow: {
					steps : [
						{type:'setVar',name:'debug',value:'3'},
						{type:'requestFlow',url:''},
						{type:'waitUntil',var:'debug',value:'4'},
						{type:'setVar',name:'debug',value:'5'},
					]
				}
			}
		};
		var mock = require('mock-require');
		 
		mock('../app/utils/MyUtil', { frequest: function(opts) {
		  console.log('mock http.request called');
		  // simulate json response in frequest
		  opts.callbackJSON({
			  flow : {
				  steps : [
					{type:'setVar',name:'debug',value:'4'},
				  ]
			  }
		  });
		}});
		  
		mock('../app/utils/nativeActivityIndicator', { enableActivityIndicator: function() {
		  console.log('mock enableActivityIndicator called');
		},disableActivityIndicator: function() {
		  console.log('mock disableActivityIndicator called');
		}});
		executeWebform(webform, function(ctx) {
			assert.equal(ctx.vars["debug"], "6");
			done();
		});
    }); // end it
  });
  
  describe('#imgshow', function() {
	it('should able to call imgshow service', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'debug',value:'1'},
					{type:'imgshow',query:'q:name=test',var:'result'},
					{type:'setVar',name:'debug',value:'2'}
				]
			}
		};
		
		var mock = require('mock-require');
		 
		mock('../app/utils/MyUtil', { imgshow:function() {
			return {
				load : function(query, cb) {
					mock.stop('../app/utils/MyUtil');
					var util = require('../app/utils/MyUtil');
					util.getVersionString = function() {return 'dummy version';}
					util.frequest = function(opts) {
						opts.callback('imgshow service response');
					}
					return util.imgshow().load(query, cb);
				}
			};
		}});
		executeWebform(webform, function(ctx) {
			assert.equal(ctx.vars["debug"], "2");
			assert.equal(ctx.vars["result"], "imgshow service response");
			done();
		});
    }); // end it
  });
  
  describe('#parallel', function() {
	it('should able to parallel two tasks', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'result',value:'1'},
					{type:'setVar',name:'task_1_flag',value:'0'},
					{type:'setVar',name:'task_2_flag',value:'0'},
					{type:'parallel',flows:['task_1','task_2'],timeout:10},
					{type:'setVar',name:'result',value:'4'},
				]
			}
			,
			flows : {
				task_1 : {
					steps : [
						{type:'setVar',name:'result',value:'2'},
						{type:'setVar',name:'task_1_flag',value:'1'}
					]
				},
				task_2 : {
					steps : [
						{type:'setVar',name:'result',value:'3'},
						{type:'setVar',name:'task_2_flag',value:'2'}
					]
				}
			}
		};
		
		executeWebform(webform, function(ctx) {
			assert.equal(ctx.vars["result"], '4');
			assert.equal(ctx.vars["task_1_flag"], '1');
			assert.equal(ctx.vars["task_2_flag"], '2');
			done();
		});
    }); // end it
	
	it('should able to parallel nothing', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'result',value:'1'},
					{type:'setVar',name:'task_1_flag',value:'0'},
					{type:'setVar',name:'task_2_flag',value:'0'},
					{type:'parallel',flows:[],timeout:1},
					{type:'parallel',timeout:1},
					{type:'setVar',name:'result',value:'4'},
				]
			}
			,
			flows : {
				task_1 : {
					steps : [
						{type:'setVar',name:'result',value:'2'},
						{type:'setVar',name:'task_1_flag',value:'1'}
					]
				},
				task_2 : {
					steps : [
						{type:'setVar',name:'result',value:'3'},
						{type:'setVar',name:'task_2_flag',value:'2'}
					]
				}
			}
		};
		
		executeWebform(webform, function(ctx) {
			assert.equal(ctx.vars["result"], '4');
			assert.equal(ctx.vars["task_1_flag"], '0');
			assert.equal(ctx.vars["task_2_flag"], '0');
			done();
		});
    }); // end it
  });
  
  
  describe('#timer', function() {
	it('should able to create timer', function(done) {
		var webform = {
			heading:'test form',
			params: [],
			flow : {
				steps: [
					{type:'setVar',name:'result',value:'0'},
					{type:'timer',action:'start',id:'myTimer',timeout:300,success_flow:'success'},
					{type:'waitUntil',var:'result',value:'1',timeout:500},
					{type:'timer',action:'stop',id:'myTimer'}
				]
			},
			flows:{
				success: {
					steps : [
						{type:'setVar',name:'result',value:'1'},
					]
				}
			}
		};
		
		executeWebform(webform, function(ctx) {
			assert.equal(ctx.vars["result"], '1');
			done();
		});
    }); // end it
  });
});