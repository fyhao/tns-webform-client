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
				setTimeout(next, 1);
			});
		}
		else if(action == 'showFileChooser') {
			var result = ctx.vars[step.result];
			// iterate and show the category view
			if(result.entries && result.entries.length) {
				ctx.showListChooser(options, function(selectedOption) {
					ctx.vars[step.selected] = selectedOption;
					setTimeout(next, 1);
				});
			}
			else {
				setTimeout(next, 1);
			}
		}
		else if(action == 'log') {
			var result = ctx.vars[step.result];
			if(result.entries && result.entries.length) {
				for(var i = 0; i < result.entries.length; i++) {
					console.log(result.entries[i]);
				}
			}
			setTimeout(next, 1);
		}
		else if(action == 'code') {
			var fn = new Function('ctx','client', 'ctx; client;' + step.code);
			fn(ctx, client);
			setTimeout(next, 1);
		}
	}
}

/*
var path = '/xxx/';
client.listFolder(path, function (result) {
	var logs = '';
	console.log('dropbox listFolder result: ');
	console.dir(result);
	if(result.entries && result.entries.length) {
		for(var i = 0; i < result.entries.length; i++) {
			console.log(result.entries[i]);
			var entry = result.entries[i];
			//logs += entry.name + '\n';
		}
	}
	//alert(logs);
	var entry = findEntryByName(result.entries, "xxx.txt");
	entry.download(function(res) {
		var localFile = res.localFile;
		localFile.readText().then(function(content) {
			var newContent = content + '\nWritten by nativescript:' + new Date().toString() + '\n';
			localFile.writeText(newContent).then(function() {
				client.uploadFileTo(newContent, '/xxx/xxx.txt', function(writeRes) {
					alert(JSON.stringify(writeRes));
				});
			});
		});
	});
});

var findEntryByName = function(entries, name) {
	if(entries && entries.length) {
		for(var i = 0; i < entries.length; i++) {
			var entry = entries[i];
			if(entry.name == name) {
				return entry;
			}
		}
	}
	return null;
}
*/