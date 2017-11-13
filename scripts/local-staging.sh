# local staging entry script

export APP_NAME="tnswebformclient"
export 'DEVELOPER_NAME="iPhone Distribution: Khor Yong Hao (C4F7EVGZVS)"'
export PROFILE_NAME="tnswebformprofile"
export NODE_VERSION="6" NPM_VERSION="3" TNS_VERSION="rc"
export 'CODE_SIGN_IDENTITY="iPhone Distribution: Khor Yong Hao (C4F7EVGZVS)"'
export PROVISIONING_PROFILE="b96261dd-8691-46d4-89f4-1cfb195e10a3"
export DEVELOPMENT_TEAM="C4F7EVGZVS"
export 'XCBUILD_SAFE_SH="/Users/travis/build/fyhao/tns-webform-client/scripts/xcbuild-safe.sh"'

export TRAVIS_BRANCH="staging"

../secured.sh

#Before Install
chmod +x ./scripts/*.sh
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

npm install

# End of Before Install

#Before Script
echo "Travis before_script"
./scripts/before-script.sh

#Script
echo "Travis script"
../nativescript-cli/bin/tns build ios --release --for-device --provision "$PROVISIONING_PROFILE" --teamId "$DEVELOPMENT_TEAM"

#after_script
echo "Travis after_script"
./scripts/after-script.sh

#after_success
echo "Travis after_success"
./scripts/after-success.sh