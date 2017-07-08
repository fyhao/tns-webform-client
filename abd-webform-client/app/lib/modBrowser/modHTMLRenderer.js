var modWidget = require('./modWidget.js');
function HTMLRenderer() {
	var params = null;
	var events = null;
	this.init = function(opts) {
		params = opts.params;
		events = opts.events;
	}
	
	this.renderHTML = function() {
		var html = '';
		
		html = '<meta name = "viewport" content = "width = 320,initial-scale = 1.0, user-scalable = no"/>'
		+ '<meta name = "viewport" content = "width = device-width"/>'
		+ '<meta name = "viewport" content = "initial-scale = 1.0"/>'
		+ '<meta name = "viewport" content = "initial-scale = 1.0, user-scalable = no"/>' + html;

		html = '<style type="text/css">'
		+ 'input[type=text]{width:360px;height:35px;font-size:16px;}'
		+ 'textarea{width:360px;font-size:16px;height:500px;}'
		+ 'select{height:30px;font-size:16px;width:360px;}'
		+ 'input,textarea,select{margin:5 0 0 5;}'
		+ '</style>' + html;
		
		html += `<script>var _createIFrame = function (src) {
		var rootElm = document.documentElement;
		var newFrameElm = document.createElement("IFRAME");
		newFrameElm.setAttribute("src", src);
		rootElm.appendChild(newFrameElm);
		return newFrameElm;
	};
	var _emitDataToIos = function (data) {
		var url = "js2ios:" + data;
		var iFrame = _createIFrame(url);
		iFrame.parentNode.removeChild(iFrame);
	};

	var handleClick = function(widgetName) {
		return function(e) {
			_emitDataToIos("evt:" + widgetName + "_onclick");
		}
	};

	var handleChange = function(widgetName) {
		return function(e) {
			// check selectone
			var oldVal = '';
			var newVal = '';
			if(document.getElementById(widgetName).selectedOptions && document.getElementById(widgetName).selectedOptions.length) {
				oldVal = document.getElementById(widgetName).oldvalue;
				newVal = document.getElementById(widgetName).selectedOptions[0].value;
			}
			else {
				oldVal = document.getElementById(widgetName).oldvalue;
				newVal = document.getElementById(widgetName).value;
			}
			_emitDataToIos("evt:" + widgetName + "_onchange;from=" + oldVal + "&to=" + newVal);
		}
	};
	</script>`;

		
		var _js = '';
		if(typeof events != 'undefined') {
			for(var _evt in events) {
				var _arr = _evt.split('_');
				if(_arr.length != 2) continue;
				var widgetName = _arr[0];
				var eventName = _arr[1];
				if(eventName == 'onclick') {
					_js += 'document.getElementById("' + widgetName + '").addEventListener("click", handleClick("' + widgetName + '"));\n\n';
					
				}
				else if(eventName == 'onchange') {
					_js += 'document.getElementById("' + widgetName + '").addEventListener("change", handleChange("' + widgetName + '"));\n\n';
					
				}
			}
		}
		
		_js += '_emitDataToIos("evt:ready");\r\n';

		html += '<script>window.onload = function() { ' + _js + ' }</script>';
		
		
		html = '<html><head>' + html + '</head><body>';
		
		for(var i = 0; i < params.length; i++) {
			var param = params[i];
			if(typeof param == 'object') {
				// search available widget
				html += modWidget.renderWidget(param);
			}
			else {
				html += '<input type="text" id="' + param + '" value="" placeholder="' + param + '" />';
			}
			html += '<br />';
		}
		
		html += '</body></html>';
		
		return html;
	}
}

module.exports.HTMLRenderer = HTMLRenderer;