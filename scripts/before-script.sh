#!/bin/sh
echo "Inside before-script"
openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in scripts/profile/tnswebformprofile.mobileprovision.enc -d -a -out scripts/profile/tnswebformprofile.mobileprovision
openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in scripts/certs/dist.cer.enc -d -a -out scripts/certs/dist.cer
openssl aes-256-cbc -k "$ENCRYPTION_SECRET" -in scripts/certs/dist.p12.enc -d -a -out scripts/certs/dist.p12

rm -fr platforms/ios
./scripts/add-key.sh