var segmentedBarModule = require("ui/segmented-bar");
var util = require('../../../utils/MyUtil.js');
module.exports = {
	
	process : function(c) {
		c.comp = new segmentedBarModule.SegmentedBar();
		var ctx = c.ctx;
		var segmentedBar = c.comp;
		var items = [];
		for(var i in c.items) {
			var cItem = c.items[i];
			var item1 = new segmentedBarModule.SegmentedBarItem();
			item1.title = cItem.title;
			items.push(item1);
		}
		segmentedBar.items = items;
	}
}