var path = require('path');
var assert = require('assert');
global.ProjRequire = function(module) {
	return require(path.join(__dirname, '/../' + module)); 
}

describe('modBrowser', function() {
  this.timeout(15000);
  var modBrowser = ProjRequire('app/lib/modBrowser/modBrowser.js');
  describe('#createBrowser', function() {
	var browser = null;
	it('should able to create browser object', function(done) {
		browser = modBrowser.createBrowser();
		assert.equal(true, browser != null);
		done();
    });
	it('should able to open the browser', function(done) {
		browser.open('url');
		done();
    });
  });
});