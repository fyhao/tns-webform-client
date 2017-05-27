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
        var fetchModule = require("fetch");
        
        fetchModule.fetch(opts.url, {
                method: opts.method ? opts.method : 'GET',
                headers: {},
                body: opts.params
            })
            .then(function(response) {
                opts.callbackJSON(JSON.parse(response._bodyInit));
            }, function(error) {
                alert(JSON.stringify(error));
                console.log('homeView fetch error')
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
};

module.exports = util;