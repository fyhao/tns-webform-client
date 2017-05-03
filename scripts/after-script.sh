#!/bin/sh
echo "Inside after-script"

read -r -a e < /tmp/tempout

PROVISIONING_TYPE="${e[2]}"


./scripts/remove-key.sh

APP_FOLDER="/Users/travis/build/fyhao/tns-webform-client/platforms/ios/build/device/"

APP_PATH="$APP_NAME.ipa"
if test "$PROVISIONING_TYPE" = '0'; then
	APP_PATH="$APP_NAME.app"
	APP_FOLDER="/Users/travis/build/fyhao/tns-webform-client/platforms/ios/build/emulator/"

fi


## TO_ZIP_FILE: 0 = .ipa file, 1 = .zip file
TO_ZIP_FILE="1" 

if test "$TO_ZIP_FILE" = '1'; then
	cd "$APP_FOLDER"
	pwd
	zip -r "$APP_NAME.zip" "$APP_NAME.app" > /dev/null
	APP_PATH="$APP_NAME.zip"
	mkdir temp
	cp -fr $APP_NAME.zip temp
	cd temp
	unzip $APP_NAME.zip
	ls -la
	
	cd "/Users/travis/build/fyhao/tns-webform-client/"
	pwd
fi


echo "APP_PATH=$APP_PATH"

ls -la ${APP_FOLDER}


curl -u $SAUCE_USERNAME:$SAUCE_ACCESS_KEY -X POST -H "Content-Type: application/octet-stream" https://saucelabs.com/rest/v1/storage/$SAUCE_USERNAME/$APP_PATH?overwrite=true --data-binary "@${APP_FOLDER}$APP_PATH"

