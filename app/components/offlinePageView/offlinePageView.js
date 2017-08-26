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
	//console.log(JSON.stringify(item));
	if(!editMode) {
		if(item.type == 'category') {
			var browser = modBrowser.createBrowser();
			browser.open(item.cat);
		}
		else if(item.type == 'item') {
			var browser = modBrowser.createBrowser();
			browser.open(item.item);
		}
	}
	else {
		var options = [];
		if(item.sourceURL != null && item.sourceURL != '') {
			options.push({id:'opt1',text:'Update from SourceURL',func:function() {
				util.frequest({
					url : item.sourceURL,
					callbackJSON : function(data) {
						item.cat = data;
						modOfflinePage.updateById(item.id, item, function() {
							console.log('saved offline page id = ' + item.id);
						});
					}
				});
			}});
		}
		options.push({id:'opt2',text:'Update title', func:function() {
			
		}});
		options.push({id:'opt3',text:'Delete', func:function() {
			var menuOptions = [];
			menuOptions.push({id:'opt1',text:'Yes, delete it',func:function() {
				modOfflinePage.deleteById(item.id, function() {
					console.log('deleted offline page id = '  item.id);
				});
			});
			util.showOptionDialog(menuOptions);
		}});
		util.showOptionDialog(options);
	}
}


// END_CUSTOM_CODE_homeView


var editMode = false;


exports.menuItemTap = menuItemTap;
exports.pageLoaded = pageLoaded;