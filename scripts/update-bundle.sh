#!/bin/sh
if [[ "$TRAVIS_PULL_REQUEST" != "false" ]]; then
  echo "This is a pull request. No deployment will be done."
  exit 0
fi
if [[ "$TRAVIS_BRANCH" != "staging" ]]; then
  echo "Testing on a branch other than staging. No deployment will be done."
  exit 0
fi


echo "DEBUG update-bundle.sh TRAVIS_PULL_REQUEST $TRAVIS_PULL_REQUEST"
echo "DEBUG update-bundle.sh TRAVIS_BRANCH $TRAVIS_BRANCH"
echo "DEBUG update-bundle.sh PROFILE_NAME $PROFILE_NAME"
echo "DEBUG update-bundle.sh Check folder platforms/ios/build/device"
ls -la /Users/travis/build/fyhao/tns-webform-client/platforms/ios/build/device
echo "DEBUG update-bundle.sh Check folder platforms/ios/build/sharedpch"
ls -la /Users/travis/build/fyhao/tns-webform-client/platforms/ios/build/sharedpch

PROVISIONING_PROFILE="~/Library/MobileDevice/Provisioning\ Profiles/$PROFILE_NAME.mobileprovision"
OUTPUTDIR="platforms/ios/build/emulator"

xcrun -log -sdk iphoneos PackageApplication "$OUTPUTDIR/$APP_NAME.app" -o "$OUTPUTDIR/$APP_NAME.ipa" -sign "$DEVELOPER_NAME" -embed "$PROVISIONING_PROFILE"

echo "DEBUG update-bundle.sh after xcrun check folder"
ls -la "$OUTPUTDIR"