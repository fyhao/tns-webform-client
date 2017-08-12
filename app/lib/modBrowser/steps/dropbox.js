var Dropbox = require('../../../utils/nativeDropbox');
module.exports = {
	
	process : function(ctx, step, next) {
		var client = new Dropbox.DropBoxClient(step.token);
		// list folder
		var action = step.action;
		if(action == 'listFolder') {
			var path = step.path;
			console.log('dropbox listFolder path: ' + path);
			client.listFolder(path, function (result) {
				console.log('dropbox listFolder result: ');
				console.dir(result);
				if(result.entries && result.entries.length) {
					for(var i = 0; i < result.entries.length; i++) {
						console.log(result.entries[i]);
					}
				}
				ctx.vars[step.result] = result;
			});
		}
		else if(action == 'log') {
			var result = ctx.vars[step.result];
			if(result.entries && result.entries.length) {
				for(var i = 0; i < result.entries.length; i++) {
					console.log(result.entries[i]);
				}
			}
		}
		setTimeout(next, 1);
	}
}