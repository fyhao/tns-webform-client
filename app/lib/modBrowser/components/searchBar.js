var SearchBar  = require("ui/search-bar").SearchBar ;
module.exports = {
	process : function(c) {
		c.comp = new SearchBar();
		var ctx = c.ctx;
		var searchBar = c.comp;
		searchBar.on(SearchBar.submitEvent, function (args) { 
			ctx.vars['_text'] = args.object.text;
			ctx.createFlowEngine(c.submit).execute(function() {});
		});
		searchBar.on(SearchBar.clearEvent, function (args) {
			ctx.createFlowEngine(c.clear).execute(function() {});
		});
	}
}