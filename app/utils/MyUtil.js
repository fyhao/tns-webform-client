var util = {
    frequest : function(opts) {
        if(typeof opts == 'undefined') opts = {};
        if(typeof opts.params == 'undefined') opts.params = '';
        else {
            var temp = '';
            var comma = '';
            for(var i in opts.params) {
                var v = opts.params[i];
                temp += comma;
                temp += i + '=' + v;
                comma = '&';
            }
            opts.params = temp;
        }
		if(typeof opts.headers == 'undefined') opts.headers = {};
		opts.headers['X-WFClient-Version'] = util.getVersionString();
        var fetchModule = require("fetch");
        
        fetchModule.fetch(opts.url, {
                method: opts.method ? opts.method : 'GET',
                headers: opts.headers,
                body: opts.params
            })
            .then(function(response) {
				if(typeof opts.callbackJSON !== 'undefined') {
					opts.callbackJSON(JSON.parse(response._bodyInit));
				}
				else if(typeof opts.callback !== 'undefined') {
					opts.callback(response._bodyInit);
				}
                
            }, function(error) {
				if(typeof opts.error !== 'undefined') {
					opts.error(error);
				}
				else 
					alert(JSON.stringify(error));
            });
    }
	,
	
	clone : function clone(item) {
		if (!item) { return item; } // null, undefined values check

		var types = [ Number, String, Boolean ], 
			result;

		// normalizing primitives if someone did new String('aaa'), or new Number('444');
		types.forEach(function(type) {
			if (item instanceof type) {
				result = type( item );
			}
		});

		if (typeof result === "undefined") {
			if (Object.prototype.toString.call( item ) === "[object Array]") {
				result = [];
				item.forEach(function(child, index, array) { 
					result[index] = clone( child );
				});
			} else if (typeof item === "object") {
				// testing that this is DOM
				if (item.nodeType && typeof item.cloneNode === "function") {
					item.cloneNode( true );    
				} else if (!item.prototype) { // check that this is a literal
					if (item instanceof Date) {
						result = new Date(item);
					} else {
						// it is an object literal
						result = {};
						for (var i in item) {
							result[i] = clone( item[i] );
						}
					}
				} else {
					result = item;
				}
			} else {
				result = item;
			}
		}

		return result;
	}
	,
	replaceAll : function(s, n,v) {
		while(s.indexOf(n) != -1) {
			s = s.replace(n,v);
		}
		return s;
	}
	,
	getVersionString : function() {
		var platform = require('tns-core-modules/platform');
		var str = 'WF-';
		str += "1.0.0";
		str += "-";
		str += platform.device.os;
		str += "-";
		str += platform.device.osVersion;
		return str;
	}
	,
	imgshow : function(request) {
		return {
            load : function(query, callback) {
				var url = "https://imgshow-platform.p.mashape.com/?k=" + encodeURIComponent(query) + "&api=1";
                var headers = { 
                    "X-Mashape-Authorization": "i5deY4OELqM0XZp3NioVjsjhhi2nbTKF"
                  };
				util.frequest({
					url : url,
					method : 'POST',
					headers : headers,
					callback : function(data) {
						callback(data);
					}
				});
            }
        }
	}
	,
	showOptionDialog : function(options, opts) {
		if(typeof opts == 'undefined') opts = {};
		var message = typeof opts.message == 'undefined' ? 'Please select an option' : opts.message;
		var options_dg = [];
		var filterOptions = [];
		for(var i = 0; i < options.length; i++) {
			var option = options[i];
			if(typeof option.enabled == 'undefined') option.enabled = function() { return true; }
			if(!option.enabled()) continue; 
			if(option.init) {
				option.init();
			}
			options_dg.push(option.text);
			filterOptions.push(option);
		}
		var dialogs = require("ui/dialogs");
		dialogs.action({
			message: message,
			cancelButtonText: "Cancel",
			actions: options_dg
		}).then(function (result) {
			console.log("Dialog result: " + result)
			for(var i = 0; i < filterOptions.length; i++) {
				var option = filterOptions[i];
				if(option.text == result) {
					if(option.func) option.func();
				}
			}
			if(opts.done) opts.done();
		});
	}
	,
	setRightNavButton : function(page, btn) {
		var enums = require("ui/enums");
		var items = page.actionBar.actionItems.getItems();
		for(var i = 0; i < items.length; i++) {
			var item = items[i];
			page.actionBar.actionItems.removeItem(item);
		}
		btn.ios.position = enums.IOSActionItemPosition.right;
		page.actionBar.actionItems.addItem(btn);
	}
	,
	fillItemTemplateVars : function(itemTemplate, items, index) {
		for(var i in itemTemplate) {
			//console.log('fillItemTemplateVars itemTemplate[i] type: ' + typeof(itemTemplate[i]));
			if(typeof itemTemplate[i] == 'function') continue;
			if(typeof itemTemplate[i] == 'object') {
				util.fillItemTemplateVars(itemTemplate[i], items, index);
			}
			else if(typeof itemTemplate[i] == 'string') {
				
				if(items.length) { // array
					//console.log('in fillItemTemplateVars before replaceAll: ' + itemTemplate[i]);
					itemTemplate[i] = util.replaceAll(itemTemplate[i], '[[item]]', items[index]); // replace {{item}}
					itemTemplate[i] = util.fillFields(itemTemplate[i], items[index]); // replace {{item.<field>}}
				}
				
				else { // object
					itemTemplate[i] = util.fillFields(itemTemplate[i], items[index]);
				}
			}
		}
	}
	,
	fillFields : function(template, items, replaceTemp) {
		if(!replaceTemp) replaceTemp = 'item.';
		for(var field in items) {
			if(typeof items[field] == 'object' && !items.length) { // if object not array, TODO array later
				template = util.fillFields(template, items[field], replaceTemp + field + '.');
			}
			else { // if string
				//console.log('in fillFields before replaceAll');
				template = util.replaceAll(template, '[[' + replaceTemp + field + ']]', items[field]);
			}
		}
		return template;
	}
};

module.exports = util;