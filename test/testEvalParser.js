var path = require('path');
var assert = require('assert');
global.ProjRequire = function(module) {
	return require(path.join(__dirname, '/../' + module)); 
}
var EvalParser = ProjRequire('app/lib/modBrowser/helperEvalParser.js');
describe('testEvalParser', function() {
  this.timeout(15000);
  describe('#Basic', function() {
	it('able to evaluate a str without {{xxx}} placeholder, to return original str', function(done) {
		var str = 'My name is fyhao.';
		var parser = new EvalParser();
		var result = parser.parse(str);
		assert.equal(result, str);
		done();
    });
  });
});