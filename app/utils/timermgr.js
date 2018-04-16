var TimerManager = function() {
	var list = [];
	this.start = function(id,timeout,success_cb) {
		var timer = new Timer(id,timeout,success_cb);
		timer.start();
		list.push(timer);
	}
}

var Timer = function(id,timeout,success_cb) {
	this.id = id;
	this.timeout = timeout;
	this.success_cb = success_cb;
	var startTime = new Date();
	var rt = null;
	var started = false;
	this.start = function() {
		if(started)return;
		started = true;
		rt = setInterval(function() {
			var now = new Date();
			var diff = now.getTime() - startTime.getTime();
			if(diff > timeout) {
				success_cb();
				clearInterval(rt);
				rt = null;
			}
		},100);
	}
}

module.exports = TimerManager;