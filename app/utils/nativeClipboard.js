// refer https://github.com/EddyVerbruggen/nativescript-clipboard
var utils = require("utils/utils");

exports.setText = function (content) {
  return new Promise(function (resolve, reject) {
    try {
      
    } catch (ex) {
      console.log("Error in clipboard.setText: " + ex);
      reject(ex);
    }
  });
};

exports.getText = function () {
  return new Promise(function (resolve, reject) {
    try {
      var pasteboard = utils.ios.getter(UIPasteboard, UIPasteboard.generalPasteboard);
      var content = pasteboard.valueForPasteboardType(kUTTypePlainText);
      resolve(content);
    } catch (ex) {
      console.log("Error in clipboard.getText: " + ex);
      reject(ex);
    }
  });
};