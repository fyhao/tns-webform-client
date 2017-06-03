module.exports.renderWidget = function(param) {
	// Input: param object
	// Output: fn (html)
	return new WidgetProcessor(param, {}).renderWidget();
}

module.exports.parseValue = function(param, opts) {
	// Input: params object
	// Input: opts object {wv}
	// Output: fn (value)
	return new WidgetProcessor(param, opts).parseValue();
}

// public variable
var widgetDefinitions = [];

var WidgetProcessor = function(param, opts) {
	
	var def = null;
	var spec = null;
	var init = function() {
		findDef();
	}
	var findDef = function() {
		if(typeof widgetDefinitions[param.type] !== 'undefined') {
			def = widgetDefinitions[param.type];
		}
		else {
			try {
				def = require('./widgets/' + param.type + '.js');
				widgetDefinitions[param.type] = def;
			} catch (e) {
				console.log(e);
			}
		}
	}
	this.renderWidget = function() {
		if(def === null) {
			return null;
		}
		var html;
		def.renderWidget(param, function(v) {
			html = v;
		});
		return html;
	}
	this.parseValue = function() {
		if(def === null) {
			return null;
		}
		if(typeof def.parseValue === 'undefined') return null;
		var value;
		def.parseValue(param, opts, function(v) {
			value = v;
		});
		return value;
	}
	this.init = function() {
		if(def === null) {
			return null;
		}
		if(typeof def.init === 'undefined') return null;
		def.init(param, opts);
	}
	init();
}