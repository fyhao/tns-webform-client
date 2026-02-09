'use strict';
var ViewModel,
    Observable = require('data/observable').Observable,
    authModule = require('../../lib/modAuth/modAuth');
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

// Initialize authentication module
authModule.init({
    provider: 'microsoft', // Can be changed to 'google', 'facebook', etc.
    clientId: 'your-client-id',
    redirectUri: 'your-app://callback',
    scopes: ['openid', 'profile', 'email']
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
        ViewModel.set('authStatus', 'Not authenticated');
    }
}

// Initial state update
updateAuthState();

// Export update function for use in view
ViewModel.updateAuthState = updateAuthState;

// END_CUSTOM_CODE_homeView
module.exports = ViewModel;