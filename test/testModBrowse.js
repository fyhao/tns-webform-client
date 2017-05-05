var path = require('path');
var assert = require('assert');
global.ProjRequire = function(module) {
	return require(path.join(__dirname, '/../' + module)); 
}

describe('modBrowse', function() {
  this.timeout(15000);
  var modBrowse = ProjRequire('app/lib/modBrowse/modBrowse.js');
  describe('#pushHistory', function() {
	it('should able to push history', function(done) {
		modBrowse.pushHistory('url', function(status) {
			assert.equal(0, status);
			done();
		});
    });
	it('should not able to push history if the url exist', function(done) {
		modBrowse.pushHistory('url', function(status) {
			assert.equal(1, status);
			done();
		});
    });
  });
  describe('#getHistory', function() {
	it('should able to get history', function(done) {
		modBrowse.getHistory(function(items) {
			assert.equal(true, items.length > 0);
			done();
		});
    });
  });
  describe('#clearHistory', function() {
	it('should able to clear history', function(done) {
		modBrowse.clearHistory(function(status) {
			assert.equal(0, status);
			done();
		});
    });
	it('should able to get empty history after cleared', function(done) {
		modBrowse.getHistory(function(items) {
			assert.equal(true, items.length == 0);
			done();
		});
    });
  });
  describe('#max 5', function() {
	it('should able to add history for url1 and length should be 1', function(done) {
		modBrowse.pushHistory('url1', function(status) {
			assert.equal(0, status);
			modBrowse.getHistory(function(items) {
				assert.equal(true, items.length == 1);
				done();
			});
		});
    });
	it('should able to see url1 in first position', function(done) {
		modBrowse.getHistory(function(items) {
			assert.equal(true, items[0] == 'url1');
			done();
		});
    });
	it('should able to add history for url2 and length should be 2', function(done) {
		modBrowse.pushHistory('url2', function(status) {
			assert.equal(0, status);
			modBrowse.getHistory(function(items) {
				assert.equal(true, items.length == 2);
				done();
			});
		});
    });
	it('should able to see url1 in second position', function(done) {
		modBrowse.getHistory(function(items) {
			assert.equal(true, items[1] == 'url1');
			done();
		});
    });
	it('should able to see url2 in first position', function(done) {
		modBrowse.getHistory(function(items) {
			assert.equal(true, items[0] == 'url2');
			done();
		});
    });
	it('should able to add history for url3 and length should be 3', function(done) {
		modBrowse.pushHistory('url3', function(status) {
			assert.equal(0, status);
			modBrowse.getHistory(function(items) {
				assert.equal(true, items.length == 3);
				done();
			});
		});
    });
	it('should able to add history for url4 and length should be 4', function(done) {
		modBrowse.pushHistory('url4', function(status) {
			assert.equal(0, status);
			modBrowse.getHistory(function(items) {
				assert.equal(true, items.length == 4);
				done();
			});
		});
    });
	it('should able to add history for url5 and length should be 5', function(done) {
		modBrowse.pushHistory('url5', function(status) {
			assert.equal(0, status);
			modBrowse.getHistory(function(items) {
				assert.equal(true, items.length == 5);
				done();
			});
		});
    });
	it('should still able to add history for url6 and length should be 5', function(done) {
		modBrowse.pushHistory('url6', function(status) {
			assert.equal(0, status);
			modBrowse.getHistory(function(items) {
				assert.equal(true, items.length == 5);
				done();
			});
		});
    });
	it('should able to see url6 in first position', function(done) {
		modBrowse.getHistory(function(items) {
			assert.equal(true, items[0] == 'url6');
			done();
		});
    });
	it('should not able to see url1 already', function(done) {
		modBrowse.getHistory(function(items) {
			assert.equal(true, items.indexOf('url1') == -1);
			done();
		});
    });
  });
});