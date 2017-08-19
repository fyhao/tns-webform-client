'use strict';
var menuItems,
    observable = require('data/observable'),
    navigationViewModel = new observable.Observable();

menuItems = [
    {
        "title": "Browse",
        "moduleName": "components/browseView/browseView",
        "icon": "\ue903"
    },
    {
        "title": "Browse from History",
        "moduleName": "components/browseHistoryView/browseHistoryView",
        "icon": "\ue903"
    },
    {
        "title": "Offline Page",
        "moduleName": "components/offlinePageView/offlinePageView",
        "icon": "\ue903"
    },
    {
        "title": "Home View",
        "moduleName": "components/homeView/homeView",
        "icon": "\ue903"
    }

];

navigationViewModel.set('menuItems', menuItems);
navigationViewModel.set('backButtonHidden', true);

module.exports = navigationViewModel;