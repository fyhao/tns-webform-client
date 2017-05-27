// IMPORT
var fs = require("file-system");

module.exports = {
	bootstrap : function() {
		_bootstrap();
	}
	,
	processStep : function(ctx, step, next) {
		_processStep(ctx, step, next);
	}
	,
	checkSpec : function(step) {
		_checkSpec(step);
	}
};

// public variable
var stepDefinitions = [];

// CONSTANTS
var LIB_STEPS_PATH = "lib/steps";

// REGION _bootstrap
var _bootstrap = function() {
	// scan available folders for step definition files
	scanRootLevelFiles();
	scanFolders();
	scanNodeModules();
}
var scanRootLevelFiles = function() {
	var list = fs.Folder.getEntitiesSync(fs.path.join(__dirname, LIB_STEPS_PATH)); 
	list.forEach(function(filename) {
		console.log(filename)
		if(filename.lastIndexOf('.js') > -1) {
			var filepath = './' + LIB_STEPS_PATH + '/' + filename;
			delete require.cache[require.resolve(filepath)]; // delete require cache
			var def = require(filepath);
			var name = filename.replace('.js', '');
			if(typeof stepDefinitions[name] !== 'undefined') {
				throw new Error('ERROR the step definition [' + name + '] exist');
			}
			stepDefinitions[name] = def;
		}
	});
}
var scanFolders = function() {
	
}
var scanNodeModules = function() {
	//TODO
}
// ENDREGION _bootstrap

// REGION _processStep

var _processStep = function(ctx, step, next) {
	var pro = new StepProcessor(ctx, step, next);
	pro.process();
}
var StepProcessor = function(ctx, step, next) {
	this.ctx = ctx;
	this.step = step;
	
	var def = null;
	var spec = null;
	var init = function() {
		findDef();
	}
	var findDef = function() {
		if(typeof stepDefinitions[step.type] !== 'undefined') {
			def = stepDefinitions[step.type];
		}
	}
	this.process = function() {
		if(def === null) {
			setTimeout(next, 1);
			return;
		}
		def.process(ctx, step, next);
	}
	init();
}

// ENDREGION _processStep