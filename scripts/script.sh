#!/bin/sh
echo "Inside script"
echo "inside script PROVISIONING_PROFILE = $PROVISIONING_PROFILE"
nativescript-cli/bin/tns build ios --release --for-device --provision "$PROVISIONING_PROFILE" --teamId "$DEVELOPMENT_TEAM"