#!/bin/sh
if [[ "$TRAVIS_PULL_REQUEST" != "false" ]]; then
  echo "This is a pull request. No deployment will be done."
  exit 0
fi
if [[ "$TRAVIS_BRANCH" != "staging" ]]; then
  echo "Testing on a branch other than staging. No deployment will be done."
  exit 0
fi

PROVISIONING_PROFILE="~/Library/MobileDevice/Provisioning\ Profiles/$PROFILE_NAME.mobileprovision"
OUTPUTDIR="platforms/ios/build/emulator"

##xcrun -log -sdk iphoneos PackageApplication "$OUTPUTDIR/$APP_NAME.app" -o "$OUTPUTDIR/$APP_NAME.ipa" -sign "$DEVELOPER_NAME" -embed "$PROVISIONING_PROFILE"
