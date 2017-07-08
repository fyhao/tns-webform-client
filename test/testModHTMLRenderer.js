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
});