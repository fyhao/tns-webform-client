var listViewModule = require("ui/list-view");
module.exports = {
	
	process : function(c) {
		c.comp = new listViewModule.ListView();
		var listView = c.comp;
		listView.items = cat.list;
		listView.on(listViewModule.ListView.itemLoadingEvent, function (args1) {
			if (!args1.view) {
				// Create label if it is not already created.
				args1.view = new labelModule.Label();
				args1.view.height = 44;
			}
			args1.view.cat = cat.list[args1.index];
			args1.view.text = cat.list[args1.index].title;

		});
	}
}