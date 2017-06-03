'use strict';
var isInit = true,
    helpers = require('../../utils/widgets/helper'),
    navigationProperty = require('../../utils/widgets/navigation-property'),
    // additional requires
    viewModel = require('./browseView-view-model'),
    modBrowse = require('../../lib/modBrowse/modBrowse.js'),
    modBrowser = require('../../lib/modBrowser/modBrowser.js')
	scanner = require('../../utils/nativeBarcodeScanner'),
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
}

// START_CUSTOM_CODE_homeView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
var view = require("ui/core/view");
function goTap(args) {
    var sender = args.object;
    var parent = sender.parent;
    if (parent) {
        var tf = view.getViewById(parent, "urlTF");
        if (tf) {
            var url = tf.text;
            modBrowse.pushHistory(url, function(status) {
                var browser = modBrowser.createBrowser();
                browser.open(url);
            });
            
        }
    }
}
function goScan(args) {
    var sender = args.object;
    var parent = sender.parent;
    if (parent) {
        scanner.scan(function(result) {
			alert(JSON.stringify(result));
		});
    }
}
exports.goTap = goTap;
exports.goScan = goScan;
// END_CUSTOM_CODE_homeView
exports.pageLoaded = pageLoaded;