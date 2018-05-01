var TimerManager = function() {
	var list = [];
	this.start = function(id,timeout,tick,success_cb, stop_cb) {
		var timer = new Timer(id,timeout,tick,success_cb, stop_cb);
		timer.start();
		list.push(timer);
	}
	this.stop = function(id) {
		for(var i = 0; i < list.length; i++) {
			if(list[i].id == id) {
				list[i].stop();
				list.splice(i,1);
			}
		}
	}
	this.get = function(id) {
		for(var i = 0; i < list.length; i++) {
			if(list[i].id == id) {
				return list[i];
			}
		}
		return null;
	}
	this.reset = function(id) {
		for(var i = 0; i < list.length; i++) {
			if(list[i].id == id) {
				list[i].reset();
				break;
			}
		}
	}
	this.update = function(id, field, value) {
		for(var i = 0; i < list.length; i++) {
			if(list[i].id == id) {
				list[i][field] = value;
				list[i].stop();
				list[i].start();
				break;
			}
		}
	}
	
	this.getList = function() {
		return list;
	}
}

var Timer = function(id,timeout,tick,success_cb, stop_cb) {
	var me = this;
	this.id = id;
	this.timeout = timeout;
	this.tick = tick;
	this.success_cb = success_cb;
	this.stop_cb = stop_cb;
	var startTime = new Date();
	var rt = null;
	var started = false;
	this.start = function() {
		if(started)return;
		started = true;
		rt = setInterval(function() {
			var now = new Date();
			var diff = now.getTime() - startTime.getTime();
			if(diff > me.timeout) {
				if(success_cb)success_cb();
				clearInterval(rt);
				rt = null;
			}
		},tick);
	}
	this.reset = function() {
		if(!started)return;
		this.stop();
		this.start();
	}
	this.stop = function() {
		clearInterval(rt);
		rt = null;
		started = false;
		if(stop_cb)stop_cb();
	}
}

module.exports = TimerManager;