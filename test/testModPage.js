var path = require('path');
var assert = require('assert');
global.ProjRequire = function(module) {
	return require(path.join(__dirname, '/../' + module)); 
}
var util = ProjRequire('app/utils/MyUtil.js');
describe('testModPage', function() {
  this.timeout(15000);
  describe('#fillItemTemplateVars', function() {
	it('fill with items 1D array, single {{item}}, single itemTemplate', function(done) {
		var items = [
			'a','b','c'
		];
		var itemTemplate = [
			{type:'label',text:'test {{item}}'}
		];
		util.fillItemTemplateVars(itemTemplate, items, 0);
		assert.equal(itemTemplate[0].text, 'test a');
		done();
    });
	it('fill with items 1D array, multi {{item}}, single itemTemplate', function(done) {
		var items = [
			'a','b','c'
		];
		var itemTemplate = [
			{type:'label',text:'test {{item}} with {{item}}'}
		];
		util.fillItemTemplateVars(itemTemplate, items, 1);
		assert.equal(itemTemplate[0].text, 'test b with b');
		done();
    });
	it('fill with items 1D array, single {{item}}, multi itemTemplate', function(done) {
		var items = [
			'a','b','c'
		];
		var itemTemplate = [
			{type:'label',text:'testa {{item}}'},
			{type:'label',text:'testb {{item}}'}
		];
		util.fillItemTemplateVars(itemTemplate, items, 0);
		assert.equal(itemTemplate[0].text, 'testa a');
		assert.equal(itemTemplate[1].text, 'testb a');
		done();
    });
	it('fill with items 1D array, multi {{item}}, multi itemTemplate', function(done) {
		var items = [
			'a','b','c'
		];
		var itemTemplate = [
			{type:'label',text:'testa {{item}} with {{item}}'},
			{type:'label',text:'testb {{item}} with {{item}}'}
		];
		util.fillItemTemplateVars(itemTemplate, items, 1);
		assert.equal(itemTemplate[0].text, 'testa b with b');
		assert.equal(itemTemplate[1].text, 'testb b with b');
		done();
    });
	it('fill with items object array', function(done) {
		var items = [
			{name:'ali',age:20},
			{name:'muthu',age:30}
		];
		var itemTemplate = [
			{type:'label',text:'name {{item.name}} age {{item.age}}'}
		];
		util.fillItemTemplateVars(itemTemplate, items, 0);
		assert.equal(itemTemplate[0].text, 'name ali age 20');
		done();
    });
	it('fill with items object array with more items level', function(done) {
		var items = [
			{name:'ali',age:20,address:{state:'JB'}},
			{name:'muthu',age:30,address:{state:'KL'}}
		];
		var itemTemplate = [
			{type:'label',text:'name {{item.name}} age {{item.age}} and state is {{item.address.state}}'}
		];
		util.fillItemTemplateVars(itemTemplate, items, 1);
		assert.equal(itemTemplate[0].text, 'name muthu age 30 and state is KL');
		done();
    });
	it('fill with items object array with more items level with more level itemTemplate', function(done) {
		var items = [
			{name:'ali',age:20,address:{state:'JB'}},
			{name:'muthu',age:30,address:{state:'KL'}}
		];
		var itemTemplate = [
			{type:'label',text:'name {{item.name}} age {{item.age}} and state is {{item.address.state}}',innerLevel:{text:'test {{item.address.state}}'}}
		];
		util.fillItemTemplateVars(itemTemplate, items, 1);
		assert.equal(itemTemplate[0].text, 'name muthu age 30 and state is KL');
		assert.equal(itemTemplate[0].innerLevel.text, 'test KL')
		done();
    });
  });
});