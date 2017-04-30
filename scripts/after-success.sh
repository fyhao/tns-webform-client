#!/bin/sh
echo "Inside after-success"
./scripts/update-bundle.sh
./scripts/sign-and-upload.sh