exports.getHistory = function(fn) {
    fn(items.slice().reverse());
}

exports.pushHistory = function(item, fn) {
	while(items.length >= 5) {
		items.splice(0,1);
	}
    if(items.indexOf(item) == -1) {
        items.push(item);
        fn(0);
    }
    else {
        fn(1);
    }
}

exports.clearHistory = function(fn) {
    items = [];
    fn(0);
}
var items = [
    'http://url1',
    'http://url2',
    'http://url3',
    'http://url4',
    'http://url5'
];