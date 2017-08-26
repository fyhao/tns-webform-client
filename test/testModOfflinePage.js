var path = require('path');
var assert = require('assert');
global.ProjRequire = function(module) {
	return require(path.join(__dirname, '/../' + module)); 
}
var modOfflinePage = ProjRequire('app/lib/modOfflinePage/modOfflinePage.js');
var _setting = {};
modOfflinePage.setSettingController({
	getString : function(key, def) {
		if(typeof _setting[key] == 'undefined') {
			_setting[key] = def;
		}
		return _setting[key];
	},
	setString : function(key, value) {
		_setting[key] = value;
	}
});
describe('testModOfflinePage', function() {
  this.timeout(15000);
  describe('#addPageInCategory', function() {
	it('add page in category', function(done) {
		_setting = {};
		modOfflinePage.addPageInCategory({list:[]},null, function(status) {
			assert.equal(status, 0);
			var json = JSON.parse(_setting['OfflinePageDB']);
			assert.equal(json.length, 1);
			var item = json[0];
			assert.equal(item.sourceURL, null);
			assert.equal(item.title, 'Untitled');
			assert.equal(item.cat.list.length, 0);
			done();
		});
    });
	it('add page in category with sourceURL', function(done) {
		_setting = {};
		modOfflinePage.addPageInCategory({list:[]},'http://google.com', function(status) {
			assert.equal(status, 0);
			var json = JSON.parse(_setting['OfflinePageDB']);
			assert.equal(json.length, 1);
			var item = json[0];
			assert.equal(item.sourceURL, 'http://google.com');
			assert.equal(item.title, 'Untitled');
			assert.equal(item.cat.list.length, 0);
			done();
		});
    });
	it('findBy', function(done) {
		_setting = {};
		modOfflinePage.addPageInCategory({list:[{type:'item',item:1}]},'http://google.com', function(status) {
			assert.equal(status, 0);
			var json = JSON.parse(_setting['OfflinePageDB']);
			assert.equal(json.length, 1);
			// actual test
			assert.equal(json[0].cat.list[0].item, 1);
			modOfflinePage.findBy('id',json[0].id, function(item) {
				item.cat = {list:[{type:'item',item:2}]};
				var json1 = JSON.parse(_setting['OfflinePageDB']);
				assert.equal(json1.length, 1);
				assert.equal(json1[0].cat.list[0].item, 1);
				done();
			});
		});
    });
	it('findById', function(done) {
		_setting = {};
		modOfflinePage.addPageInCategory({list:[{type:'item',item:1}]},'http://google.com', function(status) {
			assert.equal(status, 0);
			var json = JSON.parse(_setting['OfflinePageDB']);
			assert.equal(json.length, 1);
			// actual test
			assert.equal(json[0].cat.list[0].item, 1);
			modOfflinePage.findById(json[0].id, function(item) {
				var json1 = JSON.parse(_setting['OfflinePageDB']);
				assert.equal(json1.length, 1);
				assert.equal(json1[0].cat.list[0].item, 1);
				done();
			});
		});
    });
	it('findByTitle', function(done) {
		_setting = {};
		modOfflinePage.addPageInCategory({list:[{type:'item',item:1}]},'http://google.com', function(status) {
			assert.equal(status, 0);
			var json = JSON.parse(_setting['OfflinePageDB']);
			assert.equal(json.length, 1);
			// actual test
			assert.equal(json[0].cat.list[0].item, 1);
			modOfflinePage.findByTitle('Untitled', function(item) {
				var json1 = JSON.parse(_setting['OfflinePageDB']);
				assert.equal(json1.length, 1);
				assert.equal(json1[0].cat.list[0].item, 1);
				done();
			});
		});
    });
	it('deleteById', function(done) {
		_setting = {};
		modOfflinePage.addPageInCategory({list:[{type:'item',item:1}]},'http://google.com', function(status) {
			assert.equal(status, 0);
			var json = JSON.parse(_setting['OfflinePageDB']);
			assert.equal(json.length, 1);
			// actual test
			assert.equal(json[0].cat.list[0].item, 1);
			modOfflinePage.deleteById(json[0].id, function(item) {
				var json1 = JSON.parse(_setting['OfflinePageDB']);
				assert.equal(json1.length, 0);
				done();
			});
		});
    });
	it('findByAndSave', function(done) {
		_setting = {};
		modOfflinePage.addPageInCategory({list:[{type:'item',item:1}]},'http://google.com', function(status) {
			assert.equal(status, 0);
			var json = JSON.parse(_setting['OfflinePageDB']);
			assert.equal(json.length, 1);
			// actual test
			assert.equal(json[0].cat.list[0].item, 1);
			modOfflinePage.findByAndSave('id',json[0].id, 'save',function(item) {
				item.cat = {list:[{type:'item',item:2}]};
			}, function savefn() {
				var json1 = JSON.parse(_setting['OfflinePageDB']);
				assert.equal(json1[0].cat.list[0].item, 2);
				done();
			});
		});
    });
	it('simulate update from sourceURL of category', function(done) {
		_setting = {};
		modOfflinePage.addPageInCategory({list:[{type:'item',item:1}]},'http://google.com', function(status) {
			assert.equal(status, 0);
			var json = JSON.parse(_setting['OfflinePageDB']);
			assert.equal(json.length, 1);
			// actual test
			assert.equal(json[0].cat.list[0].item, 1);
			json[0].cat = {list:[{type:'item',item:2}]};
			modOfflinePage.updateById(json[0].id, json[0], function(status2) {
				assert.equal(status2, 0);
				var json1 = JSON.parse(_setting['OfflinePageDB']);
				assert.equal(json1[0].cat.list[0].item, 2);
				done();
			});
		});
    });
	it('getList', function(done) {
		_setting = {};
		modOfflinePage.addPageInCategory({list:[{type:'item',item:1}]},'http://google.com', function(status) {
			assert.equal(status, 0);
			var json = JSON.parse(_setting['OfflinePageDB']);
			assert.equal(json.length, 1);
			// actual test
			assert.equal(json[0].cat.list[0].item, 1);
			modOfflinePage.getList(function(items) {
				assert.equal(items.length, 1);
				assert.equal(items[0].cat.list[0].item, 1);
				done();
			});
		});
    });
	it('clearDB', function(done) {
		_setting = {};
		modOfflinePage.addPageInCategory({list:[{type:'item',item:1}]},'http://google.com', function(status) {
			assert.equal(status, 0);
			var json = JSON.parse(_setting['OfflinePageDB']);
			assert.equal(json.length, 1);
			// actual test
			assert.equal(json[0].cat.list[0].item, 1);
			modOfflinePage.clearDB(function(status) {
				assert.equal(status, 0);
				var json1 = JSON.parse(_setting['OfflinePageDB']);
				assert.equal(json1.length, 0);
				done();
			});
		});
    });
  });
});