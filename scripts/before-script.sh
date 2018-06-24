#!/bin/sh
echo "Inside before-script"

if test "$TRAVIS_BRANCH" = 'staging'; then
	read -r -a e < /tmp/tempout
	PROFILE_NAME="${e[0]}"
	PROVISIONING_PROFILE="${e[1]}"
	echo "inside before script PROVISIONING_PROFILE = $PROVISIONING_PROFILE"
	echo "CHECK OPENSSL VERSION"
	openssl version
	openssl smime -decrypt -in scripts/certs/dist.cer.enc -binary -inform DEM -inkey scripts/key/private-key.pem -out scripts/certs/dist.cer
	openssl smime -decrypt -in scripts/certs/dist.p12.enc -binary -inform DEM -inkey scripts/key/private-key.pem -out scripts/certs/dist.p12
	openssl smime -decrypt -in scripts/profile/$PROFILE_NAME.mobileprovision.enc -binary -inform DEM -inkey scripts/key/private-key.pem -out scripts/profile/$PROFILE_NAME.mobileprovision


	rm -fr platforms/ios
	./scripts/add-key.sh

fi