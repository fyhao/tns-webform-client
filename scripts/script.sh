#!/bin/sh
echo "Inside script"
read -r -a e < /tmp/tempout

PROVISIONING_PROFILE="${e[1]}"
echo "inside script PROVISIONING_PROFILE = $PROVISIONING_PROFILE"

PROVISIONING_TYPE="${e[2]}"

if test "$TRAVIS_BRANCH" = 'staging'; then
	if test "$PROVISIONING_TYPE" = '0'; then
		nativescript-cli/bin/tns build ios --emulator
	fi

	if test "$PROVISIONING_TYPE" = '1'; then
		nativescript-cli/bin/tns build ios --release --for-device --provision "$PROVISIONING_PROFILE" --teamId "$DEVELOPMENT_TEAM"
	fi

	if test "$PROVISIONING_TYPE" = '2'; then
		nativescript-cli/bin/tns build ios --release --for-device --provision "$PROVISIONING_PROFILE" --teamId "$DEVELOPMENT_TEAM"
	fi

fi

if test "$TRAVIS_BRANCH" = 'dev'; then
	npm test
fi

if test "$TRAVIS_BRANCH" = 'integration'; then
	npm test
fi