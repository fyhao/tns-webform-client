#!/bin/sh
if test "$TRAVIS_BRANCH" = 'staging'; then
	security delete-keychain ios-build.keychain
	rm -f "~/Library/MobileDevice/Provisioning Profiles/$PROFILE_NAME.mobileprovision"
fi