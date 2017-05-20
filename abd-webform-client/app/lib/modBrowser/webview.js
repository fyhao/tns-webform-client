var _createIFrame = function (src) {
    var rootElm = document.documentElement;
    var newFrameElm = document.createElement("IFRAME");
    newFrameElm.setAttribute("src", src);
    rootElm.appendChild(newFrameElm);
    return newFrameElm;
};

/**
 * Sends handshaking signal to iOS using custom url, for sending event payload or JS Call response.
 * As iOS do not allow to send any data from webView. Here we are sending data in two steps.
 * 1. Send handshake signal, by loading custom url in iFrame with metadata (eventName, unique responseId)
 * 2. On intercept of this request, iOS calls _getIOSResponse with the responseId to fetch the data.
 */
var _emitDataToIos = function (data) {
    var url = 'js2ios:' + data;
    var iFrame = _createIFrame(url);
    iFrame.parentNode.removeChild(iFrame);
};

var handleClick = function(widgetName) {
    return function(e) {
        _emitDataToIos('evt:' + widgetName + '_onclick');
    }
}