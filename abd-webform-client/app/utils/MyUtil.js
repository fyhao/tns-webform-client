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
};

module.exports = util;