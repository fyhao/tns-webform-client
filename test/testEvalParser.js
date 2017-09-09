var path = require('path');
var assert = require('assert');
global.ProjRequire = function(module) {
	return require(path.join(__dirname, '/../' + module)); 
}
var EvalParser = ProjRequire('app/lib/modBrowser/helperEvalParser.js');
describe('testEvalParser', function() {
  this.timeout(15000);
  function testParse(str, expected, ctx) {
		var parser = new EvalParser();
		var result = parser.parse(str, ctx);
		assert.equal(result, expected);
  }
 describe('#evalCode', function() {
	it('able to eval a variable', function(done) {
		var parser = new EvalParser();
		var result = parser.evalCode('age', {age:123});
		assert.equal(result, '123');
		done();
    });
	it('able to eval JS operations', function(done) {
		var parser = new EvalParser();
		var result = parser.evalCode('3+6', {});
		assert.equal(result, '9');
		done();
    });
	it('able to eval string', function(done) {
		var parser = new EvalParser();
		var result = parser.evalCode("'fyhao'", {});
		assert.equal(result, 'fyhao');
		done();
    });
	it('able to eval variable and string', function(done) {
		var parser = new EvalParser();
		var result = parser.evalCode("'fyhao is ' + age + ' years old'", {age:123});
		assert.equal(result, 'fyhao is 123 years old');
		done();
    });
  });
  describe('#Basic Invalid Cases', function() {
	it('able to evaluate a str without {{xxx}} placeholder, to return original str', function(done) {
		var str = 'My name is fyhao and 123 years old.';
		testParse(str, str, {});
		done();
    });
	it('able to evaluate a str with single {xxxx} placeholder which is not the expected JS expression bracket, should return original str', function(done) {
		var str = 'My name is fyhao and {age} years old.';
		testParse(str, str, {age:123});
		done();
    });
	it('able to evaluate a str with multiple {xxxx} placeholder which is not the expected JS expression bracket, should return original str', function(done) {
		var str = 'My name is {name}} and {age} years old.';
		testParse(str, str, {age:123,name:'fyhao'});
		done();
    });
  });
   /*
  describe('#Basic Valid Cases', function() {
	it('able to evaluate a str with single {{xxx}} placeholder of variable', function(done) {
		var str = 'My name is fyhao and {{age}} years old.';
		var exp = 'My name is fyhao and 123 years old';
		testParse(str, exp, {age:123});
		done();
    });
	it('able to evaluate a str with multiple {{xxx}} placeholder of variable', function(done) {
		var str = 'My name is {{name}} and {{age}} years old.';
		var exp = 'My name is fyhao and 123 years old';
		testParse(str, exp, {age:123,name:'fyhao'});
		done();
    });
	it('able to evaluate a str with a {{xx}} placeholder of JS Operations', function(done) {
		var str = 'My name is fyhao and {{100+23}} years old.';
		var exp = 'My name is fyhao and 123 years old';
		testParse(str, exp, {});
		done();
    });
	it('able to evaluate a str with multiple {{xx}} placeholder of JS Operations', function(done) {
		var str = "My name is {{'fyhao'}} and {{100+23}} years old.";
		var exp = 'My name is fyhao and 123 years old';
		testParse(str, exp, {});
		done();
    });
	it('able to evaluate a str with multiple {{xx}} placeholder of JS Operation plus variables', function(done) {
		var str = "My name is {{'fyhao'}} and {{100+23}} {{criteria}}.";
		var exp = 'My name is fyhao and 123 years old';
		testParse(str, exp, {criteria:'years old'});
		done();
    });
  });
*/
  
});