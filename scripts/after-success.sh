#!/bin/sh
echo "Inside after-success"
if test "$TRAVIS_BRANCH" = 'staging'; then
	./scripts/update-bundle.sh
	./scripts/sign-and-upload.sh
fi

if test "$TRAVIS_BRANCH" = 'dev'; then
	npm run coverage
fi

if test "$TRAVIS_BRANCH" = 'integration'; then
	npm run coverage
fi