var listViewModule = require("ui/list-view");
var labelModule = require("ui/label");
var util = require('../../../utils/MyUtil.js');
module.exports = {
	
	process : function(c) {
		c.comp = new listViewModule.ListView();
		var ctx = c.ctx;
		var listView = c.comp;
		//console.log('processing listview, items: ' + JSON.stringify(c.items));
		var items = null;
		if(typeof c.items == 'object') {
			items = c.items;
		}
		else if(typeof c.items == 'string') {
			items = ctx.vars[c.items];
			c.items = items;
		}
		listView.items = items;
		listView.on(listViewModule.ListView.itemLoadingEvent, function (args1) {
			//console.log('listView itemLoadingEvent');
			if(c.itemTemplate) {
				var itemTemplate = util.clone(c.itemTemplate);
				util.fillItemTemplateVars(itemTemplate, items, args1.index);
				//console.log('listView after fillItemTemplateVars itemTemplate: ' + JSON.stringify(itemTemplate));
				c.processType(itemTemplate);
				args1.view = itemTemplate.comp;
			}
			else {
				if (!args1.view) {
					// Create label if it is not already created.
					args1.view = new labelModule.Label();
					args1.view.height = 44;
				}
				args1.view.item = items[args1.index];
				args1.view.text = items[args1.index].title;
			}
		});
		listView.on(listViewModule.ListView.itemTapEvent, function (args2) {
			var tappedItemIndex = args2.index;
			var tappedItemView = args2.view;
			var flow = c.tap;
			ctx.vars['_items'] = items;
			ctx.vars['_index'] = args2.index;
			ctx.createFlowEngine(flow).execute(function() {});
		});
	}
}

