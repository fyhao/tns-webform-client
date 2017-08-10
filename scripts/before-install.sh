#!/bin/sh
echo "Inside before-install"

echo "Current running branch $TRAVIS_BRANCH"

## Here put a switch for ad hoc and app store distribution
## 1 = ad hoc, 2 = app store, 0 = emulator
PROVISIONING_TYPE="1"
if test "$PROVISIONING_TYPE" = '1'; then
	PROFILE_NAME="tnswebformprofile"
	PROVISIONING_PROFILE="b96261dd-8691-46d4-89f4-1cfb195e10a3"
fi

if test "$PROVISIONING_TYPE" = '2'; then
	PROFILE_NAME="tnswebformappstore"
	PROVISIONING_PROFILE="986f708a-ebbf-4d8c-afda-4e5f82c934c4"
fi

declare -a e
e[0]="$PROFILE_NAME"
e[1]="$PROVISIONING_PROFILE"
e[2]="$PROVISIONING_TYPE"
echo "${e[@]}" > /tmp/tempout




wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
source ~/.nvm/nvm.sh && nvm install $NODE_VERSION && nvm use $NODE_VERSION
PATH="`npm bin`:`npm bin -g`:$PATH"
if test "$TRAVIS_BRANCH" = 'staging'; then
	brew update > /dev/null;
fi
npm install -g npm@$NPM_VERSION

if test "$TRAVIS_BRANCH" = 'staging'; then
	
		npm install -g nativescript@$TNS_VERSION
		tns usage-reporting disable
	
fi
npm install
if test "$TRAVIS_BRANCH" = 'staging'; then
  # CocoaPods
	gem install cocoapods --pre --no-rdoc --no-ri --no-document --quiet
	gem install xcpretty --no-rdoc --no-ri --no-document --quiet
	pod --version
	pod setup --silent
	pod repo update --silent
	  # Show environment invo
	node --version
	npm --version
	tns --version
	xcpretty --version
	xcodebuild -version
	xcodebuild -showsdks
fi
