'use strict';
var isInit = true,
    helpers = require('../../utils/widgets/helper'),
    navigationProperty = require('../../utils/widgets/navigation-property'),
    // additional requires
    viewModel = require('./offlinePageView-view-model'),
	modOfflinePage = require('../../lib/modOfflinePage/modOfflinePage.js'),
	modBrowser = require('../../lib/modBrowser/modBrowser.js'),
	actionBarModule = require("ui/action-bar"),
	buttonModule = require("ui/button"),
	util = require('../../utils/MyUtil')
	;

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
	loadItems();
	
	// NAVBUTTON - start
	var navButton = new actionBarModule.NavigationButton();
	navButton.text = 'Edit'
	navButton.height = 44;
	navButton.on(buttonModule.Button.tapEvent, function() {
		if(!editMode)
			navButton.text = 'Done';
		else
			navButton.text = 'Edit';
		
		editMode = !editMode;
	})
	util.setRightNavButton(page, navButton);
	// NAVBUTTON - end

	
}
function loadItems() {
    modOfflinePage.getList(function(items) {
        var menuItems = [];
        for(var i = 0; i < items.length; i++) {
            var item = items[i];
            menuItems.push({
                "title": "[" + item.title + "]",
                "item" : item,
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
    var item = menuItem.item;
	if(item.type == 'cat') {
		var browser = modBrowser.createBrowser();
		browser.open(item.cat);
	}
	else if(item.type == 'item') {
		var browser = modBrowser.createBrowser();
		browser.open(item.item);
	}
}


// END_CUSTOM_CODE_homeView


var editMode = false;



exports.pageLoaded = pageLoaded;