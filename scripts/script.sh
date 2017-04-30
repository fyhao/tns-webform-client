#!/bin/sh
echo "Inside script"
read -r -a e < /tmp/tempout

PROVISIONING_PROFILE="${e[1]}"
echo "inside script PROVISIONING_PROFILE = $PROVISIONING_PROFILE"
nativescript-cli/bin/tns build ios --release --for-device --provision "$PROVISIONING_PROFILE" --teamId "$DEVELOPMENT_TEAM"