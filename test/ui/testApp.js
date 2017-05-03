var username = "tnswebform",
    accessKey = "f3788906-9c25-4a55-8e74-f6b160cccba6";
 
//https://github.com/appium/sample-code/blob/master/sample-code/examples/node/ios-complex.js

var wd = require('wd'),
    desiredCaps = {
         browserName: '',
	appiumVersion: '1.6.3',
	deviceName: 'iPhone 7 Simulator',
	platformVersion: '10.2',
	platformName: 'iOS',
	name: 'Test Click Home View',
    'username': username,
    'accessKey': accessKey,
	"app" : "sauce-storage:tnswebformclient.zip"
    },
    driver = wd.remote("https://" + username + ":" + accessKey + "@" + "ondemand.saucelabs.com:443/wd/hub", 'promiseChain');
 
driver.init(desiredCaps, function(error) {
    if (error) {
        throw new Error('Session did not start properly. Please make sure you sauce credentials are correct');
    }
}).delay(5000)
.then(function() {
	console.log('click tableview');
	console.log(driver.elementsByName('Home View'));
	console.log(driver.elementsByName('Home View').first());
	return driver.elementsByName('Home View').first().click().delay(3000);
}).sleep(3000)
.then(function() {
	return driver.elementsByName('Sign in4567').first().tap().delay(3000);
})
.acceptAlert().sleep(3000)
.then(function() {
	console.log('quit');
	return driver.quit();
});

driver.on("status", function (info) {
    console.log(info.cyan);
  });
  driver.on("command", function (meth, path, data) {
    console.log(" > " + meth.yellow + path.grey + " " + (data || ""));
  });
  driver.on("http", function (meth, path, data) {
    console.log(" > " + meth.magenta + path + " " + (data || "").grey);
  });
// refer https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
