var application = require('application'),
    mainModule = 'navigation/navigation';

// START_CUSTOM_CODE_nativeScriptApp
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

require('./lib/modURLHandler/modURLHandler.js').handleURLScheme();

var geolocation = require("nativescript-geolocation");
if(!geolocation.isEnabled()) {
	iosLocationManager.requestWhenInUseAuthorization();
}

// END_CUSTOM_CODE_nativeScriptApp
application.start({
    moduleName: mainModule
});
