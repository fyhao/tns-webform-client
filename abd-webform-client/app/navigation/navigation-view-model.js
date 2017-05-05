'use strict';
var menuItems,
    observable = require('data/observable'),
    navigationViewModel = new observable.Observable();

menuItems = [
    {
        "title": "Browse",
        "moduleName": "components/browseView/browseView",
        "icon": "\ue0dd"
    },
    {
        "title": "Browse from History",
        "moduleName": "components/homeView/homeView",
        "icon": "\ue0dd"
    },
    {
        "title": "Home View",
        "moduleName": "components/homeView/homeView",
        "icon": "\ue0dd"
    }

];

navigationViewModel.set('menuItems', menuItems);
navigationViewModel.set('backButtonHidden', true);

module.exports = navigationViewModel;