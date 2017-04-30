#!/bin/sh
echo "Inside script"
read -r -a e < /tmp/tempout
echo "DEBUG array e"
echo "${e[@]}"
e[2]="test"
echo "DEBUG array e after set test"
echo "${e[@]}"
echo "${e[@]}" > /tmp/tempout
read -r -a e < /tmp/tempout
echo "DEBUG array e after rewrite"
echo "${e[@]}"

PROVISIONING_PROFILE="${e[1]}"
echo "inside script PROVISIONING_PROFILE = $PROVISIONING_PROFILE"
nativescript-cli/bin/tns build ios --release --for-device --provision "$PROVISIONING_PROFILE" --teamId "$DEVELOPMENT_TEAM"