#!/bin/sh
echo "Inside before-script"


read -r -a e < /tmp/tempout
PROFILE_NAME="${e[0]}"
PROVISIONING_PROFILE="${e[1]}"
echo "inside before script PROVISIONING_PROFILE = $PROVISIONING_PROFILE"
openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in scripts/profile/$PROFILE_NAME.mobileprovision.enc -d -a -out scripts/profile/$PROFILE_NAME.mobileprovision
openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in scripts/certs/dist.cer.enc -d -a -out scripts/certs/dist.cer
openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in scripts/certs/dist.p12.enc -d -a -out scripts/certs/dist.p12

rm -fr platforms/ios
./scripts/add-key.sh