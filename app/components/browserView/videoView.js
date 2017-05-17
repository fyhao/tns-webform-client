// Event handler for Page "loaded" event attached in main-page.xml
function pageLoaded(args) {
    // Get the event sender    
    var page = args.object;
    var data = page.navigationContext;
    var url = data.url;
    var videoPlayer = page.getViewById('nativeVideoPlayer');
    videoPlayer.src = url;
}
exports.pageLoaded = pageLoaded;