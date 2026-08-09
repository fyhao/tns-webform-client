'use strict';
var ViewModel,
    Observable = require('data/observable').Observable,
    authModule = require('../../lib/modAuth/modAuth'),
    appSettings = require('application-settings');
// additional requires

ViewModel = new Observable({

    pageTitle: 'Home View',
    isAuthenticated: false,
    userName: '',
    userEmail: '',
    authStatus: 'Not authenticated'
    // additional properties
});

// START_CUSTOM_CODE_homeView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// OAuth values are supplied at deployment time and are never committed as secrets.
var authConfigured = authModule.init({
    provider: appSettings.getString('oauth.provider', 'microsoft'),
    clientId: appSettings.getString('oauth.clientId', ''),
    redirectUri: appSettings.getString('oauth.redirectUri', ''),
    urlScheme: appSettings.getString('oauth.urlScheme', ''),
    scopes: appSettings.getString('oauth.scopes', 'openid profile email offline_access').split(/\s+/)
});

// Update UI based on auth state
function updateAuthState() {
    var isAuth = authModule.isAuthenticated();
    var user = authModule.getCurrentUser();
    
    ViewModel.set('isAuthenticated', isAuth);
    
    if (isAuth && user) {
        ViewModel.set('userName', user.name || '');
        ViewModel.set('userEmail', user.email || '');
        ViewModel.set('authStatus', 'Authenticated as ' + user.name);
    } else {
        ViewModel.set('userName', '');
        ViewModel.set('userEmail', '');
        ViewModel.set('authStatus', authConfigured ? 'Not authenticated' : 'OAuth is not configured');
    }
}

// Restore any secure session before presenting the initial state.
authModule.ready().then(updateAuthState);

// Export update function for use in view
ViewModel.updateAuthState = updateAuthState;

// END_CUSTOM_CODE_homeView
module.exports = ViewModel;
