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
  function testThrow(str, expected, ctx) {
		var parser = new EvalParser();
		var exception = false;
		try {
			var result = parser.parse(str, ctx);
		} catch (e) {
			exception = true;
		}
		assert.equal(exception, true);
  }
 
  describe('#evaluate', function() {
	  
	it('able to eval single placeholder', function(done) {
		var str = 'My name is fyhao and {{age}} years old.';
		var parser = new EvalParser();
		var result = parser.evaluate(str);
		assert.equal(result.length, 1);
		assert.equal(result[0], 'age');
		done();
    });
	it('able to eval multiple placeholder', function(done) {
		var str = 'My name is {{name}} and {{age}} years old.';
		var parser = new EvalParser();
		var result = parser.evaluate(str);
		assert.equal(result.length, 2);
		assert.equal(result[0], 'name');
		assert.equal(result[1], 'age');
		done();
    });
	it('able to eval single placeholder with another sub placeholder inside code', function(done) {
		var str = "My name is fyhao and {{'pre {{age}} post'}} years old.";
		var parser = new EvalParser();
		var result = parser.evaluate(str);
		assert.equal(result.length, 1);
		assert.equal(result[0], "'pre {{age}} post'");
		done();
    });
	it('able to eval two placeholder with another sub placeholder inside code', function(done) {
		var str = "My name is {{name}} and {{'pre {{age}} post'}} years old.";
		var parser = new EvalParser();
		var result = parser.evaluate(str);
		assert.equal(result.length, 2);
		assert.equal(result[0], 'name');
		assert.equal(result[1], "'pre {{age}} post'");
		done();
    });
	it('able to eval multi placeholder with another sub placeholder inside code', function(done) {
		var str = "My name is {{name}} and {{'pre {{age}} post'}} years {{'pre2 {{age2}} post2'}}.";
		var parser = new EvalParser();
		var result = parser.evaluate(str);
		assert.equal(result.length, 3);
		assert.equal(result[0], 'name');
		assert.equal(result[1], "'pre {{age}} post'");
		assert.equal(result[2], "'pre2 {{age2}} post2'");
		done();
    });
  });
  
 
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
	it('able to eval object', function(done) {
		var parser = new EvalParser();
		var result = parser.evalCode("'fyhao is ' + y.age + ' years old'", {y:{age:123}});
		assert.equal(result, 'fyhao is 123 years old');
		done();
    });
	it('able to eval array', function(done) {
		var parser = new EvalParser();
		var result = parser.evalCode("'fyhao is ' + y[1] + ' years old'", {y:[123,456]});
		assert.equal(result, 'fyhao is 456 years old');
		done();
    });
	it('able to eval a variable with return', function(done) {
		var parser = new EvalParser();
		var result = parser.evalCode('return age', {age:123});
		assert.equal(result, '123');
		done();
    });
	it('able to eval string with return', function(done) {
		var parser = new EvalParser();
		var result = parser.evalCode("return 'fyhao'", {});
		assert.equal(result, 'fyhao');
		done();
    });
	it('able to eval JS operations with return', function(done) {
		var parser = new EvalParser();
		var result = parser.evalCode('return 3+6', {});
		assert.equal(result, '9');
		done();
    });
	it('able to evaluate expression if variable not defined', function(done) {
		var parser = new EvalParser();
		var result = parser.evalCode('boy', {});
		assert.equal(result, '');
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
 
  describe('#Basic Valid Cases', function() {
	
	it('able to evaluate a str with single {{xxx}} placeholder of variable', function(done) {
		var str = 'My name is fyhao and {{age}} years old.';
		var exp = 'My name is fyhao and 123 years old.';
		testParse(str, exp, {age:123});
		done();
    });
	it('able to evaluate a str with multiple {{xxx}} placeholder of variable', function(done) {
		var str = 'My name is {{name}} and {{age}} years old.';
		var exp = 'My name is fyhao and 123 years old.';
		testParse(str, exp, {age:123,name:'fyhao'});
		done();
    });
	it('able to evaluate a str with a {{xx}} placeholder of JS Operations', function(done) {
		var str = 'My name is fyhao and {{100+23}} years old.';
		var exp = 'My name is fyhao and 123 years old.';
		testParse(str, exp, {});
		done();
    });
	it('able to evaluate a str with multiple {{xx}} placeholder of JS Operations', function(done) {
		var str = "My name is {{'fyhao'}} and {{100+23}} years old.";
		var exp = 'My name is fyhao and 123 years old.';
		testParse(str, exp, {});
		done();
    });
	it('able to evaluate a str with multiple {{xx}} placeholder of JS Operation plus variables', function(done) {
		var str = "My name is {{'fyhao'}} and {{100+23}} {{criteria}}.";
		var exp = 'My name is fyhao and 123 years old.';
		testParse(str, exp, {criteria:'years old'});
		done();
    });
	
  });

  describe('#Intermediate Cases', function() {
	
	it('Testing on conditional statements', function(done) {
		testParse('I am {{age > 60 ? "old" : "young"}}', 'I am old', {age:123});
		testParse('I am {{if(age>60) return "old"; else return "young";}}', 'I am old', {age:123});
		testParse('I am {{if(age>60) {return "old"} else {return "young"} }}', 'I am old', {age:123});
		testParse('I am {{if(age>60 && age<=80) {return "old"} else {return "very old"} }}', 'I am very old', {age:123});
		testParse('I am {{if(age>60 && age<=80) {return "old"} else {return "very old"} }}', 'I am very old', {age:60});
		testParse('I am {{if(age>60 && age<=80) {return "old"} else {return "very old"} }}', 'I am old', {age:80});
		testParse('I am {{if(age>60 && age<=80) {return "old"} else {return "very old"} }}', 'I am very old', {age:59});
		testParse('I am {{if(age>60 && age<=80) {return "old"} else {return "very old"} }}', 'I am very old', {age:81});
		done();
    });
	it('Testing on while statements', function(done) {
		testParse('I am {{t=1;while(age>120){age-=50;t+=1;} return "age:"+age+";" + t}}', 'I am age:73;2', {age:123});
		done();
    });
	it('Testing on comment statements', function(done) {
		testParse('I am {{/*some comments return age*/return age}}', 'I am 123', {age:123});
		testParse('I am {{//some comments return age\nreturn age}}', 'I am 123', {age:123});
		done();
    });
  });
  
  describe('#Exception Cases', function() {
	
	it('Exception testing', function(done) {
		testThrow('I am {{if(age>60) {return "old"} else {return "young"}}}', 'I am old', {age:123});
		done();
    });
  });
});