module.exports = function(){
	this.result = '';
	this.patterns = '';
	this.parse = function(str, vars) {
		this.result = str;
		this.patterns = this.evaluate(str); // -> [pattern1,pattern2]
		for(var i = 0; i < this.patterns.length; i++) {
			var pattern = this.pattern[i];
			var res = this.evalCode(pattern, vars);
			this.result = replacePatternRes(this.result, pattern, res);
		}
		return this.result;
	}
	this.evaluate = function(str) {
		return [];
	}
	this.evalCode = function(code, vars) {
		if(code.indexOf('return') == -1) {
			code = 'return ' + code;
		}
		var val = new Function('vars', 'vars;for(key in vars) {global[key] = vars[key];} ' + code);
		return val(vars);
	}
	var replacePatternRes = function(result, pattern, res) {
		return result;
	}
}