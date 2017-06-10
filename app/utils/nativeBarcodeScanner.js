var BarcodeScanner = require("nativescript-barcodescanner").BarcodeScanner;
  
module.exports = {
	scan : function(fn) {
		var barcodescanner = new BarcodeScanner();

		  barcodescanner.scan({
			formats: "QR_CODE,PDF_417",   // Pass in of you want to restrict scanning to certain types
			cancelLabel: "EXIT. Also, try the volume buttons!", // iOS only, default 'Close'
			cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
			message: "Use the volume buttons for extra light", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
			showFlipCameraButton: true,   // default false
			preferFrontCamera: false,     // default false
			showTorchButton: true,        // default false
			beepOnScan: true,             // Play or Suppress beep on scan (default true)
			torchOn: false,               // launch with the flashlight on (default false)
			resultDisplayDuration: 500,   // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
			orientation: "landscape",     // Android only, optionally lock the orientation to either "portrait" or "landscape"
			openSettingsIfPermissionWasPreviouslyDenied: true // On iOS you can send the user to the settings app if access was previously denied
		  }).then(
			  function(result) {
				console.log("Scan format: " + result.format);
				console.log("Scan text:   " + result.text);
				fn(null, result);
			  },
			  function(error) {
				console.log("No scan: " + error);
				fn(error);
			  }
		  );
	}
};