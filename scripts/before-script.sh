#!/bin/sh
echo "Inside before-script"

## Here put a switch for ad hoc and app store distribution
## 1 = ad hoc, 2 = app store
PROVISIONING_TYPE = "2"
if test "$PROVISIONING_TYPE" = '1' then
	PROFILE_NAME="tnswebformprofile"
	PROVISIONING_PROFILE="b96261dd-8691-46d4-89f4-1cfb195e10a3"
fi

if test "$PROVISIONING_TYPE" = '2' then
	PROFILE_NAME="tnswebformappstore"
	PROVISIONING_PROFILE="986f708a-ebbf-4d8c-afda-4e5f82c934c4"
fi

openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in scripts/profile/$PROFILE_NAME.mobileprovision.enc -d -a -out scripts/profile/$PROFILE_NAME.mobileprovision
openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in scripts/certs/dist.cer.enc -d -a -out scripts/certs/dist.cer
openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in scripts/certs/dist.p12.enc -d -a -out scripts/certs/dist.p12

rm -fr platforms/ios
./scripts/add-key.sh