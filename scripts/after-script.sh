#!/bin/sh
echo "Inside after-script"
./scripts/remove-key.sh

ls -la /Users/travis/build/fyhao/tns-webform-client/platforms/ios/build/device/
curl -u $SAUCE_USERNAME:$SAUCE_ACCESS_KEY -X POST -H "Content-Type: application/octet-stream" https://saucelabs.com/rest/v1/storage/$SAUCE_USERNAME/$APP_NAME.ipa?overwrite=true --data-binary "@/Users/travis/build/fyhao/tns-webform-client/platforms/ios/build/device/tnswebformclient.ipa"