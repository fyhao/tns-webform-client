var pagesModule = require("ui/page");
var StackLayout = require("ui/layouts/stack-layout").StackLayout;
var GridLayout = require("ui/layouts/grid-layout").GridLayout;
var webViewModule = require("ui/web-view");
var buttonModule = require("ui/button");
var textFieldModule = require("ui/text-field");
var textViewModule = require("ui/text-view");
var listPickerModule = require("ui/list-picker");
var listViewModule = require("ui/list-view");
var labelModule = require("ui/label");
var actionBarModule = require("ui/action-bar");
var util = require('../../utils/MyUtil');
var sharer = require('../../utils/nativeSharer');
var helpers = require('../../utils/widgets/helper');
var modWebform = require('./modWebform.js');

module.exports.createBrowser = function() {
	return new Browser();
}

function Browser() {
	this.open = function(url) {
		showCategory(url);
	}
}

function showCategory(url) {
    var page = new pagesModule.Page();
    var loadData = function() {
        var listView = new listViewModule.ListView();
        page.content = listView;
    
        util.frequest({
            url : url,
            callbackJSON : function(cat) {
                
                listView.items = cat.list;
                listView.on(listViewModule.ListView.itemLoadingEvent, function (args1) {
                    if (!args1.view) {
                        // Create label if it is not already created.
                        args1.view = new labelModule.Label();
                        args1.view.height = 44;
                    }
                    args1.view.cat = cat.list[args1.index];
                    args1.view.text = cat.list[args1.index].title;

                });
                listView.on(listViewModule.ListView.itemTapEvent, function (args2) {
                    var tappedItemIndex = args2.index;
                    var tappedItemView = args2.view;
                    var item = tappedItemView.cat;
                    showItem(item);
                });
				var customMenus = cat.customMenus;
                if(customMenus && customMenus.length) {
                    var options = [];
                    for(var i = customMenus.length - 1; i >= 0; i--) {
                        var menu = customMenus[i];
                        var option = {
                            'id' : 'menu_' + i,
                            'text' : menu.title,
                            'menu' : menu,
                            'func' : function() {
                                if(this.menu.url) {
                                    showWebView(this.menu.url);
                                }
                                if(this.menu.requesturl) {
                                    showCategory(this.menu.requesturl);
                                }
                                if(this.menu.webform) {
                                    modWebform.showItemWebform(this.menu.webform);
                                }
                            }
                        };
                        options.splice(0,0,option);
                    }
                }
                var navButton = new actionBarModule.NavigationButton();
                navButton.text = '[ ]'
                navButton.height = 44;
                navButton.on(buttonModule.Button.tapEvent, function() {
                    util.showOptionDialog(options);
                })
                util.setRightNavButton(page, navButton);
            }
        });
    }
    
    loadData();
    helpers.navigate(function(){return page;});
}
function showItem(item) {
    if(item.type == 'url') {
        if(item.content.indexOf('youtube') != -1 || item.content.indexOf('.mp4') != -1) {
            showItemVideo(item);
        }
        else {
            showItemURL(item);
        }
    }
    else if(item.type == 'category') {
        showCategory(item.requesturl);
    }
    else if(item.type == 'webform') {
        modWebform.showItemWebform(item.webform);
    }
}
function showItemVideo(item) {
    helpers.navigate({
        moduleName : 'components/browserView/videoView',
        context : {url:item.content}
    });
}
function showItemURL(item) {
    var page = new pagesModule.Page();
    var stackLayout = new StackLayout();
    page.content = stackLayout;
    var titleLabel = new labelModule.Label();
    titleLabel.text = item.title;
    stackLayout.addChild(titleLabel);
    var descLabel = new labelModule.Label();
    descLabel.text = item.description;
    stackLayout.addChild(descLabel);
    var openButton = new buttonModule.Button();
    openButton.text = 'OPEN';
    openButton.on(buttonModule.Button.tapEvent, function (args) {
        showWebView(item.content);
    });
    stackLayout.addChild(openButton);
    var shareButton = new buttonModule.Button();
    shareButton.text = 'SHARE';
    shareButton.on(buttonModule.Button.tapEvent, function (args) {
        sharer.shareText(item.content);
    });
    stackLayout.addChild(shareButton);
    helpers.navigate(function(){return page;});
}

function showWebView(url) {
    var page = new pagesModule.Page();
    var gridLayout = new GridLayout();
    page.content = gridLayout;
    var webView = new webViewModule.WebView();
    webView.url = url;
    gridLayout.addChild(webView);
    helpers.navigate(function(){return page;});
}

modWebform.setFunc('showCategory', showCategory);
modWebform.setFunc('showWebView', showWebView);
