# local staging entry script

export APP_NAME="tnswebformclient"
export 'DEVELOPER_NAME="iPhone Distribution: Khor Yong Hao (C4F7EVGZVS)"'
export PROFILE_NAME="tnswebformprofile"
export NODE_VERSION="6" NPM_VERSION="3" TNS_VERSION="rc"
export 'CODE_SIGN_IDENTITY="iPhone Distribution: Khor Yong Hao (C4F7EVGZVS)"'
export PROVISIONING_PROFILE="b96261dd-8691-46d4-89f4-1cfb195e10a3"
export DEVELOPMENT_TEAM="C4F7EVGZVS"
export 'XCBUILD_SAFE_SH="/Users/travis/build/fyhao/tns-webform-client/scripts/xcbuild-safe.sh"'


#Before Install
chmod +x ./scripts/*.sh
./scripts/before-install.sh

#Before Script
echo "Travis before_script"
./scripts/before-script.sh

#Script
echo "Travis script"
./scripts/script.sh

#after_script
echo "Travis after_script"
./scripts/after-script.sh

#after_success
echo "Travis after_success"
./scripts/after-success.sh