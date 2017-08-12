'use strict';
var isInit = true,
    helpers = require('../../utils/widgets/helper'),
    navigationProperty = require('../../utils/widgets/navigation-property'),
    // additional requires
    viewModel = require('./browseHistoryView-view-model'),
    modBrowse = require('../../lib/modBrowse/modBrowse.js'),
    modBrowser = require('../../lib/modBrowser/modBrowser.js');

// additional functions
function pageLoaded(args) {
    var page = args.object;

    helpers.platformInit(page);
    page.bindingContext = viewModel;
    // additional pageLoaded

    if (isInit) {
        isInit = false;

        // additional pageInit
        
    }
    loadHistory();
}

function loadHistory() {
    modBrowse.getHistory(function(items) {
        var menuItems = [];
        for(var i = 0; i < items.length; i++) {
            var item = items[i];
            menuItems.push({
                "title": "[" + item + "]",
                "url" : item,
                "icon": "\ue903"
            },);
        }
        viewModel.set('menuItems', menuItems);
    });
}

// START_CUSTOM_CODE_homeView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
var view = require("ui/core/view");
function menuItemTap(args) {
    var sender = args.object;
    var parent = sender.parent;
    var menuItems = viewModel.get('menuItems');
    var menuItem = menuItems[args.index];
    var url = menuItem.url;
    modBrowse.browseURL(url);
}

exports.menuItemTap = menuItemTap;
// END_CUSTOM_CODE_homeView
exports.pageLoaded = pageLoaded;