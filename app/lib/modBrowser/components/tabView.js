var tabViewModule = require("ui/tab-view");
var util = require('../../../utils/MyUtil.js');
module.exports = {
	
	process : function(c) {
		c.comp = new tabViewModule.TabView();
		var ctx = c.ctx;
		var tabView = c.comp;
		tabView.on(tabViewModule.TabView.selectedIndexChangedEvent, function(args) {
			var actualOldIndex = args.oldIndex;
			var actualNewIndex = args.newIndex;
			ctx.vars['_actualOldIndex'] = actualOldIndex;
			ctx.vars['_actualNewIndex'] = actualNewIndex;
			ctx.createFlowEngine(c.selectedIndexChanged).execute(function() {});
		});
		var items = [];
		for(var i in c.items) {
			var cItem = c.items[i];
			var tabEntry0 = new tabViewModule.TabViewItem();
			tabEntry0.title = cItem.title;
			var template = util.clone(cItem.template);
			c.processType(template);
			tabEntry0.view = template.comp;
			items.push(tabEntry0);
		}
		tabView.items = items;
	}
}