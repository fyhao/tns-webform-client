module.exports = function(){
	this.result = '';
	this.patterns = '';
	this.parse = function(str) {
		this.result = str;
		this.patterns = this.evaluate(str); // -> [pattern1,pattern2]
		for(var i = 0; i < this.patterns.length; i++) {
			var pattern = this.pattern[i];
			var res = evalJS(pattern);
			this.result = replacePatternRes(this.result, pattern, res);
		}
		return this.result;
	}
	this.evaluate = function(str) {
		return [];
	}
	var evalJS = function(js) {
		return '';
	}
	var replacePatternRes = function(result, pattern, res) {
		return result;
	}
}