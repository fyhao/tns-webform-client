'use strict';
var isInit = true,
    helpers = require('../../utils/widgets/helper'),
    navigationProperty = require('../../utils/widgets/navigation-property'),
    // additional requires
    viewModel = require('./homeView-view-model'),
    authModule = require('../../lib/modAuth/modAuth'),
    dialogs = require('ui/dialogs');

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

exports.signIn = function() {
    authModule.login()
        .then(function(user) {
            viewModel.updateAuthState();
            dialogs.alert({
                title: "Success",
                message: "Successfully logged in as " + user.name,
                okButtonText: "OK"
            });
        })
        .catch(function(error) {
            dialogs.alert({
                title: "Error",
                message: "Login failed: " + error.message,
                okButtonText: "OK"
            });
        });
};

exports.signOut = function() {
    authModule.logout()
        .then(function() {
            viewModel.updateAuthState();
            dialogs.alert({
                title: "Success",
                message: "Successfully logged out",
                okButtonText: "OK"
            });
        })
        .catch(function(error) {
            dialogs.alert({
                title: "Error",
                message: "Logout failed: " + error.message,
                okButtonText: "OK"
            });
        });
};

// END_CUSTOM_CODE_homeView
exports.pageLoaded = pageLoaded;