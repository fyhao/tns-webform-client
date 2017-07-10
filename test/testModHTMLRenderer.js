var path = require('path');
var assert = require('assert');
global.ProjRequire = function(module) {
	return require(path.join(__dirname, '/../' + module)); 
}
var modHTMLRenderer = ProjRequire('app/lib/modBrowser/modHTMLRenderer.js');
describe('#modHTMLRenderer', function() {
  this.timeout(15000);
  
  describe('#textbox', function() {
	it('should able to render textbox', function(done) {
		var webform = {
			heading:'test form',
			params: [
				{type:'text', name:'field1'}
			],
		};
		var HTMLRenderer = new modHTMLRenderer.HTMLRenderer();
		HTMLRenderer.init(webform);
		var html = HTMLRenderer.renderHTML();
		assert.equal(html.indexOf('<input type="text" id="field1" value="" placeholder="field1" cols="100" style="visibility:visible" onfocus="this.oldvalue = this.value;"/>') > -1, true);
		done();
    });
  });
  
  describe('#textarea', function() {
	it('should able to render textarea', function(done) {
		var webform = {
			heading:'test form',
			params: [
				{type:'textarea', name:'field1'}
			],
		};
		var HTMLRenderer = new modHTMLRenderer.HTMLRenderer();
		HTMLRenderer.init(webform);
		var html = HTMLRenderer.renderHTML();
		assert.equal(html.indexOf('<textarea id="field1"  style="visibility:visible" onfocus="this.oldvalue = this.value;"></textarea>') > -1, true);
		done();
    });
  });
  
  describe('#label', function() {
	it('should able to render label', function(done) {
		var webform = {
			heading:'test form',
			params: [
				{type:'label', id:'lblName',name:'Label content'}
			],
		};
		var HTMLRenderer = new modHTMLRenderer.HTMLRenderer();
		HTMLRenderer.init(webform);
		var html = HTMLRenderer.renderHTML();
		assert.equal(html.indexOf('<span id="lblName" style="visibility:visible">Label content</span>') > -1, true);
		done();
    });
  });
  
  describe('#html', function() {
	it('should able to render html', function(done) {
		var webform = {
			heading:'test form',
			params: [
				{type:'html', name:'box',html:'<span>test</span>'}
			],
		};
		var HTMLRenderer = new modHTMLRenderer.HTMLRenderer();
		HTMLRenderer.init(webform);
		var html = HTMLRenderer.renderHTML();
		assert.equal(html.indexOf('<div id="box" style="visibility:visible"><span>test</span></div>') > -1, true);
		done();
    });
  });
  
  describe('#hidden', function() {
	it('should able to render hidden', function(done) {
		var webform = {
			heading:'test form',
			params: [
				{type:'hidden', name:'age',value:'20'}
			],
		};
		var HTMLRenderer = new modHTMLRenderer.HTMLRenderer();
		HTMLRenderer.init(webform);
		var html = HTMLRenderer.renderHTML();
		assert.equal(html.indexOf('<input type="hidden" id="age" value="20" />') > -1, true);
		done();
    });
  });
  
  
  describe('#datePicker', function() {
	it('should able to render datePicker', function(done) {
		var webform = {
			heading:'test form',
			params: [
				{type:'datePicker', name:'date',value:'2017-01-01'}
			],
		};
		var HTMLRenderer = new modHTMLRenderer.HTMLRenderer();
		HTMLRenderer.init(webform);
		var html = HTMLRenderer.renderHTML();
		assert.equal(html.indexOf('<input type="date" id="date" value="2017-01-01" style="visibility:visible"/>') > -1, true);
		done();
    });
  });
  
  describe('#timePicker', function() {
	it('should able to render timePicker', function(done) {
		var webform = {
			heading:'test form',
			params: [
				{type:'timePicker', name:'time',value:'12:00'}
			],
		};
		var HTMLRenderer = new modHTMLRenderer.HTMLRenderer();
		HTMLRenderer.init(webform);
		var html = HTMLRenderer.renderHTML();
		assert.equal(html.indexOf('<input type="time" id="time" value="12:00" style="visibility:visible"/>') > -1, true);
		done();
    });
  });
  
  describe('#button', function() {
	it('should able to render single button', function(done) {
		var webform = {
			heading:'test form',
			params: [
				{type:'button', name:'SendBtn',title:'CLICK TO SEND'}
			],
		};
		var HTMLRenderer = new modHTMLRenderer.HTMLRenderer();
		HTMLRenderer.init(webform);
		var html = HTMLRenderer.renderHTML();
		assert.equal(html.indexOf('<input type="button" id="SendBtn" value="CLICK TO SEND" style="visibility:visible"/>') > -1, true);
		done();
    });
	it('should able to render multiple buttons', function(done) {
		var webform = {
			heading:'test form',
			params: [
				{type:'button', buttons:[{name:'SendBtn',title:'CLICK TO SEND'},{name:'ResetBtn',title:'CLICK TO RESET'}]}
			],
		};
		var HTMLRenderer = new modHTMLRenderer.HTMLRenderer();
		HTMLRenderer.init(webform);
		var html = HTMLRenderer.renderHTML();
		assert.equal(html.indexOf('<div><input type="button" id="SendBtn" value="CLICK TO SEND" style="visibility:visible"/><input type="button" id="ResetBtn" value="CLICK TO RESET" style="visibility:visible"/></div>') > -1, true);
		done();
    });
  });
  
  describe('#imgshow', function() {
	it('should able to render imgshow', function(done) {
		var webform = {
			heading:'test form',
			params: [
				{type:'imgshow', id:'box',query:'q:name=youtube,k=test'}
			],
		};
		var HTMLRenderer = new modHTMLRenderer.HTMLRenderer();
		HTMLRenderer.init(webform);
		var html = HTMLRenderer.renderHTML();
		assert.equal(html.indexOf('<div id="box" style="visibility:visible"></div>') > -1, true);
		done();
    });
  });
  
  describe('#qrcode', function() {
	it('should able to render qrcode', function(done) {
		var webform = {
			heading:'test form',
			params: [
				{type:'qrcode', id:'box',query:'test'}
			],
		};
		var HTMLRenderer = new modHTMLRenderer.HTMLRenderer();
		HTMLRenderer.init(webform);
		var html = HTMLRenderer.renderHTML();
		assert.equal(html.indexOf('<div id="box" style="visibility:visible"></div>') > -1, true);
		done();
    });
  });
  
  describe('#selectone', function() {
	it('should able to render selectone with key value', function(done) {
		var webform = {
			heading:'test form',
			params: [
				{type:'selectone', name:'country', options:[{key:'Malaysia',value:'my'},{key:'Singapore',value:'sg'}], value:'sg'}
			],
		};
		var HTMLRenderer = new modHTMLRenderer.HTMLRenderer();
		HTMLRenderer.init(webform);
		var html = HTMLRenderer.renderHTML();
		assert.equal(html.indexOf('<select id="country" style="visibility:visible" onfocus="this.oldvalue = this.selectedOptions[0].value"><option value="my" >Malaysia</option><option value="sg" selected>Singapore</option></select>') > -1, true);
		done();
    });
	it('should able to render selectone with array', function(done) {
		var webform = {
			heading:'test form',
			params: [
				{type:'selectone', name:'country', options:['my','sg'], value:'sg'}
			],
		};
		var HTMLRenderer = new modHTMLRenderer.HTMLRenderer();
		HTMLRenderer.init(webform);
		var html = HTMLRenderer.renderHTML();
		assert.equal(html.indexOf('<select id="country" style="visibility:visible" onfocus="this.oldvalue = this.selectedOptions[0].value"><option value="my" >my</option><option value="sg" selected>sg</option></select>') > -1, true);
		done();
    });
  });
});