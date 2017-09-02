var gridLayoutModule = require("ui/layouts/grid-layout");
module.exports = {
	
	process : function(c) {
		c.comp = new gridLayoutModule.GridLayout();
		var ItemSpec = gridLayoutModule.ItemSpec;
		var gridLayout = c.comp;
		if(c.columns) {
			var arr = c.columns.split(',');
			for(var i in arr) {
				var k = arr[i].trim();
				if(k == '*') {
					gridLayout.addColumn(new ItemSpec(1, 'star'));
				}
				else if(k == 'auto') {
					gridLayout.addColumn(new ItemSpec(1, 'auto'));
				}
				else {
					gridLayout.addColumn(new ItemSpec(parseInt(k), 'pixel'));
				}
			}
		}
		if(c.rows) {
			var arr = c.rows.split(',');
			for(var i in arr) {
				var k = arr[i].trim();
				if(k == '*') {
					gridLayout.addRow(new ItemSpec(1, 'star'));
				}
				else if(k == 'auto') {
					gridLayout.addRow(new ItemSpec(1, 'auto'));
				}
				else {
					gridLayout.addRow(new ItemSpec(parseInt(k), 'pixel'));
				}
			}
		}
	}
}