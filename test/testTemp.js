var path = require('path');
var assert = require('assert');
global.ProjRequire = function(module) {
	return require(path.join(__dirname, '/../' + module)); 
}

describe('test', function() {
  this.timeout(15000);
  
  describe('test', function() {
	it('should able to test something', function(done) {
		done();
    });
  });
});