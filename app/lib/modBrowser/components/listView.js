var listViewModule = require("ui/list-view");
var util = require('../../../utils/MyUtil.js');
module.exports = {
	
	process : function(c) {
		c.comp = new listViewModule.ListView();
		var ctx = c.ctx;
		var listView = c.comp;
		console.log('processing listview, items: ' + JSON.stringify(c.items));
		listView.items = c.items;
		listView.on(listViewModule.ListView.itemLoadingEvent, function (args1) {
			console.log('listView itemLoadingEvent');
			if(c.itemTemplate) {
				var itemTemplate = util.clone(c.itemTemplate);
				util.fillItemTemplateVars(itemTemplate, c.items, args1.index);
				console.log('listView after fillItemTemplateVars itemTemplate: ' + JSON.stringify(itemTemplate));
				c.processType(itemTemplate);
				if(!args1.view) {
					args1.view = itemTemplate.comp;
				}
			}
			else {
				if (!args1.view) {
					// Create label if it is not already created.
					args1.view = new labelModule.Label();
					args1.view.height = 44;
				}
				args1.view.item = c.items[args1.index];
				args1.view.text = c.items[args1.index].title;
			}
		});
		listView.on(listViewModule.ListView.itemTapEvent, function (args2) {
			var tappedItemIndex = args2.index;
			var tappedItemView = args2.view;
			var flow = c.tap;
			ctx.vars['_items'] = c.items;
			ctx.vars['_index'] = args2.index;
			ctx.createFlowEngine(flow).execute(function() {});
		});
	}
}

