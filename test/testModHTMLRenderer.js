var path = require('path');
var assert = require('assert');
global.ProjRequire = function(module) {
	return require(path.join(__dirname, '/../' + module)); 
}
var modHTMLRenderer = ProjRequire('app/lib/modBrowser/modHTMLRenderer.js');
var modWidget = ProjRequire('app/lib/modBrowser/modWidget.js');
describe('#modHTMLRenderer modWidget', function() {
  this.timeout(15000);
  function createTestCase(param, content, code, done) {
	  var webform = {
		heading:'test form',
		params: [
			param
		],
	};
	var HTMLRenderer = new modHTMLRenderer.HTMLRenderer();
	HTMLRenderer.init(webform);
	var html = HTMLRenderer.renderHTML();
	assert.equal(html.indexOf(content) > -1, true);
	assert.equal(content, modWidget.renderWidget(webform.params[0]))
	var _testRanCodes = [];
	if(code != 'NO CODE HERE') {
		var result = modWidget.parseValue(webform.params[0], {
			wv : {
				runJSSync : function(code) {
					_testRanCodes.push(code);
					return 'returnedValue';
				}
			}
		});
		assert.equal(result, 'returnedValue');
		assert.equal(_testRanCodes.length, 1);
		assert.equal(_testRanCodes[0], code);
	}
	done();
  }
  describe('#textbox', function() {
	it('should able to render textbox', function(done) {
		createTestCase({type:'text', name:'field1'}, 
		'<input type="text" id="field1" value="" placeholder="field1" cols="100" style="visibility:visible" onfocus="this.oldvalue = this.value;"/>', 
		'document.getElementById("field1").value',
		done);
    });
  });
  
  describe('#textarea', function() {
	it('should able to render textarea', function(done) {
		createTestCase({type:'textarea', name:'field1'}, 
		'<textarea id="field1"  style="visibility:visible" onfocus="this.oldvalue = this.value;"></textarea>', 
		'document.getElementById("field1").value',
		done);
    });
  });
  
  describe('#label', function() {
	it('should able to render label', function(done) {
		createTestCase({type:'label', id:'lblName',name:'Label content'}, 
		'<span id="lblName" style="visibility:visible">Label content</span>', 
		'NO CODE HERE',
		done);
    });
  });
  
  describe('#html', function() {
	it('should able to render html', function(done) {
		createTestCase({type:'html', name:'box',html:'<span>test</span>'}, 
		'<div id="box" style="visibility:visible"><span>test</span></div>', 
		'NO CODE HERE',
		done);
    });
  });
  
  describe('#hidden', function() {
	it('should able to render hidden', function(done) {
		createTestCase({type:'hidden', name:'age',value:'20'}, 
		'<input type="hidden" id="age" value="20" />', 
		'document.getElementById("age").value',
		done);
    });
  });
  
  
  describe('#datePicker', function() {
	it('should able to render datePicker', function(done) {
		createTestCase({type:'datePicker', name:'date',value:'2017-01-01'}, 
		'<input type="date" id="date" value="2017-01-01" style="visibility:visible"/>', 
		'document.getElementById("date").value',
		done);
    });
  });
  
  describe('#timePicker', function() {
	it('should able to render timePicker', function(done) {
		createTestCase({type:'timePicker', name:'time',value:'12:00'}, 
		'<input type="time" id="time" value="12:00" style="visibility:visible"/>', 
		'document.getElementById("time").value',
		done);
    });
  });
  
  describe('#button', function() {
	it('should able to render single button', function(done) {
		createTestCase({type:'button', name:'SendBtn',title:'CLICK TO SEND'}, 
		'<input type="button" id="SendBtn" value="CLICK TO SEND" style="visibility:visible"/>', 
		'NO CODE HERE',
		done);
    });
	it('should able to render multiple buttons', function(done) {
		createTestCase({type:'button', buttons:[{name:'SendBtn',title:'CLICK TO SEND'},{name:'ResetBtn',title:'CLICK TO RESET'}]}, 
		'<div><input type="button" id="SendBtn" value="CLICK TO SEND" style="visibility:visible"/><input type="button" id="ResetBtn" value="CLICK TO RESET" style="visibility:visible"/></div>', 
		'NO CODE HERE',
		done);
    });
  });
  
  describe('#imgshow', function() {
	it('should able to render imgshow', function(done) {
		createTestCase({type:'imgshow', id:'box',query:'q:name=youtube,k=test'}, 
		'<div id="box" style="visibility:visible"></div>', 
		'NO CODE HERE',
		done);
    });
  });
  
  describe('#qrcode', function() {
	it('should able to render qrcode', function(done) {
		createTestCase({type:'qrcode', id:'box',query:'test'}, 
		'<div id="box" style="visibility:visible"></div>', 
		'NO CODE HERE',
		done);
    });
  });
  
  describe('#selectone', function() {
	it('should able to render selectone with key value', function(done) {
		createTestCase({type:'selectone', name:'country', options:[{key:'Malaysia',value:'my'},{key:'Singapore',value:'sg'}], value:'sg'}, 
		'<select id="country" style="visibility:visible" onfocus="this.oldvalue = this.selectedOptions[0].value"><option value="my" >Malaysia</option><option value="sg" selected>Singapore</option></select>', 
		'document.getElementById("country").selectedOptions[0].value',
		done);
    });
	it('should able to render selectone with array', function(done) {
		createTestCase({type:'selectone', name:'country', options:['my','sg'], value:'sg'}, 
		'<select id="country" style="visibility:visible" onfocus="this.oldvalue = this.selectedOptions[0].value"><option value="my" >my</option><option value="sg" selected>sg</option></select>', 
		'document.getElementById("country").selectedOptions[0].value',
		done);
    });
  });
});