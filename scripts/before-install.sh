#!/bin/sh
echo "Inside before-install"
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.0/install.sh | bash
source ~/.nvm/nvm.sh && nvm install $NODE_VERSION && nvm use $NODE_VERSION
PATH="`npm bin`:`npm bin -g`:$PATH"
brew update > /dev/null;
npm install -g npm@$NPM_VERSION
npm install grunt-cli -g
git clone https://github.com/fyhao/nativescript-cli
cd nativescript-cli
git submodule update --init
npm install
grunt
cd ../
npm install
  # CocoaPods
gem install cocoapods --pre --no-rdoc --no-ri --no-document --quiet
gem install xcpretty --no-rdoc --no-ri --no-document --quiet
pod --version
pod setup --silent
pod repo update --silent
  # Show environment invo
node --version
npm --version
nativescript-cli/bin/tns --version
xcpretty --version
xcodebuild -version
xcodebuild -showsdks


echo "inside before install PROVISIONING_PROFILE = $PROVISIONING_PROFILE"