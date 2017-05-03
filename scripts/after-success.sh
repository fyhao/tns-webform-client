#!/bin/sh
echo "Inside after-success"
if test "$TRAVIS_BRANCH" = 'staging'; then
	./scripts/update-bundle.sh
	./scripts/sign-and-upload.sh
fi