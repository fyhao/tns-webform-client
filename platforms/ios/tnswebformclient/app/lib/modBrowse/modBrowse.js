exports.getHistory = function(fn) {
    fn(items);
}

exports.pushHistory = function(item, fn) {
    items.push(item);
    fn(0);
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