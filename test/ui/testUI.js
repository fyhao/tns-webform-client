var modHTMLRenderer = require('../../app/lib/modBrowser/modHTMLRenderer.js');
var HTMLRenderer = modHTMLRenderer.HTMLRenderer;
var r = new HTMLRenderer();
var params = [
	{type:'button',name:'submitBtn',title:'Submit Btn'},
	{type:'button',name:'submitBtn',title:'Submit Btn 23445'},
	{type:'button',buttons:[{name:'submitBtn',title:'22'},{name:'submitBtn',title:'22'},{name:'submitBtn',title:'22'},{name:'submitBtn',title:'Submit Btn2'},{name:'submitBtn',title:'Submit Btn2'},{name:'submitBtn',title:'Submit Btn2'}]}
];
r.init({params:params});
var html = r.renderHTML();

var server = require('http').createServer(function(req, res) {
	res.end(html)
}).listen(12345);
