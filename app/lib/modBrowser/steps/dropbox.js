var Dropbox = require('../../../utils/nativeDropbox');
module.exports = {
	
	process : function(ctx, step, next) {
		var client = new Dropbox.DropBoxClient(step.token);
		// list folder
		console.log('dropbox listFolder path: ' + path);
		client.listFolder(path, function (result) {
            console.log('dropbox listFolder result: ');
			console.log(result);
		});
		setTimeout(next, 1);
	}
}