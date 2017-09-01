var listViewModule = require("ui/list-view");
var util = require('../../../utils/MyUtil.js');
module.exports = {
	
	process : function(c) {
		c.comp = new listViewModule.ListView();
		var listView = c.comp;
		console.log('processing listview, items: ' + JSON.stringify(c.items));
		listView.items = c.items;
		listView.on(listViewModule.ListView.itemLoadingEvent, function (args1) {
			console.log('listView itemLoadingEvent');
			if(c.itemTemplate) {
				fillItemTemplateVars(c.itemTemplate, c.items, args1.index);
				console.log('listView after fillItemTemplateVars itemTemplate: ' + JSON.stringify(c.itemTemplate));
				c.processType(c.itemTemplate);
				if(!args1.view) {
					args1.view = c.itemTemplate.comp;
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
	}
}

var fillItemTemplateVars = function(itemTemplate, items, index) {
	for(var i in itemTemplate) {
		if(typeof itemTemplate[i] == 'object') {
			fillItemTemplateVars(itemTemplate[i], items, index);
		}
		else {
			// replace {{item}}
			if(items.length) { // array
				itemTemplate[i] = util.replaceAll(itemTemplate[i], '{{item}}', items[index]);
			}
			// replace {{item.<field>}}
			else { // object
				itemTemplate[i] = fillFields(itemTemplate[i], items[index]);
			}
		}
	}
}
var fillFields = function(template, items, replaceTemp) {
	if(!replaceTemp) replaceTemp = 'item.';
	for(var field in items) {
		if(typeof items[field] == 'object' && !items.length) { // if object not array, TODO array later
			template = fillFields(template, items[field], replaceTemp + field + '.');
		}
		else { // if string
			template = util.replaceAll(template, '{{' + replaceTemp + field + '}}', items[index][field]);
		}
	}
	return template;
}