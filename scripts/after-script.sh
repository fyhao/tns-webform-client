#!/bin/sh
echo "Inside after-script"

read -r -a e < /tmp/tempout

PROVISIONING_TYPE="${e[2]}"


./scripts/remove-key.sh

ls -la /Users/travis/build/fyhao/tns-webform-client/platforms/ios/build/device/



APP_PATH="$APP_NAME.ipa"
if test "$PROVISIONING_TYPE" = '0'; then
	APP_PATH="$APP_NAME.app"
fi

echo "APP_PATH=$APP_PATH"

curl -u $SAUCE_USERNAME:$SAUCE_ACCESS_KEY -X POST -H "Content-Type: application/octet-stream" https://saucelabs.com/rest/v1/storage/$SAUCE_USERNAME/$APP_PATH?overwrite=true --data-binary "@/Users/travis/build/fyhao/tns-webform-client/platforms/ios/build/device/$APP_PATH"