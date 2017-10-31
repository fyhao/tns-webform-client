var gridLayoutModule = require("ui/layouts/grid-layout");
module.exports = {
	
	process : function(c) {
		c.comp = new gridLayoutModule.GridLayout();
		var ItemSpec = gridLayoutModule.ItemSpec;
		var gridLayout = c.comp;
		c._innerItems = [];
		if(c.columns) {
			var arr = c.columns.split(',');
			for(var i in arr) {
				var k = arr[i].trim();
				if(k == '*') {
					var item = new ItemSpec(1, 'star');
					gridLayout.addColumn(item);
					c._innerItems.push(['column',item]);
				}
				else if(k == 'auto') {
					var item = new ItemSpec(1, 'auto');
					gridLayout.addColumn(item);
					c._innerItems.push(['column',item]);
				}
				else {
					var item = new ItemSpec(parseInt(k), 'pixel');
					gridLayout.addColumn(item);
					c._innerItems.push(['column',item]);
				}
			}
		}
		if(c.rows) {
			var arr = c.rows.split(',');
			for(var i in arr) {
				var k = arr[i].trim();
				if(k == '*') {
					var item = new ItemSpec(1, 'star');
					gridLayout.addRow(item);
					c._innerItems.push(['row',item]);
				}
				else if(k == 'auto') {
					var item = new ItemSpec(1, 'auto');
					gridLayout.addRow(item);
					c._innerItems.push(['row',item]);
				}
				else {
					var item = new ItemSpec(parseInt(k), 'pixel');
					gridLayout.addRow(item);
					c._innerItems.push(['row',item]);
				}
			}
		}
	}
	,
	postComponentProcess : function(c) {
		var gridLayout = c.comp;
		if(c.childs && c.childs.length) {
			c.childs.forEach(function(child) {
				var row = child.row;
				var col = child.col;
				if(typeof row != 'undefined') {
					gridLayoutModule.GridLayout.setRow(child.comp, row);
				}
				if(typeof col != 'undefined') {
					gridLayoutModule.GridLayout.setColumn(child.comp, col);
				}
			});
		}
	}
}