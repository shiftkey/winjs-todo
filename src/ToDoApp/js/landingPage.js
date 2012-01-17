(function () {
    'use strict';

    var listRenderer;
    var headerRenderer;
    var itemRenderer;
    var pageLayout;

    var itemsSource; // handles the reordering of items in the UI
    var items; // allows for basic array operations

    // event handler for when the application has navigated to my page
    WinJS.Application.addEventListener('fragmentappended', function handler(e) {
        if (e.location === '/html/landingPage.html') { fragmentLoad(e.fragment, e.state); }
    });

    function fragmentLoad(elements, options) {
        try {
            var appLayout = Windows.UI.ViewManagement.ApplicationLayout.getForCurrentView();
            if (appLayout) {
                appLayout.addEventListener('layoutchanged', layoutChanged);
            }
        } catch (e) { }

        // asynchronously apply bindings within a fragment
        WinJS.UI.processAll(elements)
            .then(function () {
            itemRenderer = elements.querySelector('.itemTemplate');
            headerRenderer = elements.querySelector('.headerTemplate');
            listRenderer = elements.querySelector('.listTemplate');
            var lv = WinJS.UI.getControl(elements.querySelector('.landingList'));
            updateForLayout(lv, Windows.UI.ViewManagement.ApplicationLayout.value);

            document.getElementById('add').addEventListener('click', addNewItem, false);
        });
    }

    function updateForLayout(lv, layout) {
        pageLayout = layout;
        if (pageLayout === Windows.UI.ViewManagement.ApplicationLayoutState.snapped) {
            renderSnapped(lv);
        } else {
            renderMainView(lv);
        }
        lv.refresh();
    }

    function renderSnapped(lv) {
        var doingTaskGroup = pageData.groups[1];
        var doingTasks = [];

        // find tasks only in that middle list
        for (var i = 0; i < items.length; i++) {
            var currentItem = items[i];
            if (currentItem.group == doingTaskGroup) {
                doingTasks.push(currentItem);
            }
        }

        WinJS.UI.setOptions(lv, {
            dataSource: doingTasks,
            itemRenderer: listRenderer,
            groupDataSource: null,
            groupRenderer: null,
            oniteminvoked: itemInvoked
        });

        lv.layout = new WinJS.UI.ListLayout();
    }

    function renderMainView(lv) {
        var groupDataSource = new WinJS.UI.GroupDataSource(
            new WinJS.UI.ListDataSource(pageData.groups),
            function (item) {
            return {
                key: item.data.group.key,
                data: {
                    title: item.data.group.title,
                }
            };
        });

        WinJS.UI.setOptions(lv, {
            dataSource: pageData.items,
            itemRenderer: itemRenderer,
            groupDataSource: groupDataSource,
            groupRenderer: headerRenderer,
            oniteminvoked: itemInvoked
        });
        lv.layout = new WinJS.UI.GridLayout({ groupHeaderPosition: 'top' });
    }

    function layoutChanged(e) {
        var list = document.querySelector('.landingList');
        if (list) {
            var lv = WinJS.UI.getControl(list);
            updateForLayout(lv, e.layout);
        }
    }

    function itemInvoked(e) {
        if (pageLayout === Windows.UI.ViewManagement.ApplicationLayoutState.snapped) {
            // ignore the click when in snapped mode
        } else {
            var item = items[e.detail.itemIndex];
            WinJS.Navigation.navigate('/html/detailPage.html', { item: item });
        }
    }

    function getGroups() {
        var groups = [];

        groups.push({
            key: 'group1',
            title: 'Backlog',
            label: 'Tasks I haven\'t started',
        });

        groups.push({
            key: 'group2',
            title: 'In Progress',
            label: 'Tasks that are underway',
        });

        groups.push({
            key: 'group3',
            title: 'Done',
            label: 'Tasks that are completed',
        });
        return groups;
    }

    function getUrl(image) {
        return 'url(/images/items/' + image + ')';
    }

    function addNewItem() {
        var newItem = {
            group: pageData.groups[0],
            key: 'backlog' + (items.length + 1),
            title: 'New Task',
            subtitle: 'Put some words here',
            backgroundImage: getUrl('sydjs.png'),
        };
        items.splice(0, 0, newItem);
        itemsSource.insertAtStart("not-used", newItem);
    }

    function getItems() {
        var colors = ['rgba(209, 211, 212, 1)', 'rgba(147, 149, 152, 1)', 'rgba(65, 64, 66, 1)'];
        items = [];

        CreateMockBacklog(items);
        CreateCurrentItems(items);
        CreateCompletedItems(items);

        itemsSource = WinJS.UI.ArrayDataSource(items);
        return itemsSource;
    }

    function CreateMockBacklog(items) {
        items.push({
            group: pageData.groups[0],
            key: 'backlog1',
            title: 'Code52',
            subtitle: 'Ensure that you mention it!',
            backgroundImage: getUrl('code52.png')
        });
        items.push({
            group: pageData.groups[0],
            key: 'backlog2',
            title: 'Givecamp',
            subtitle: 'Ensure that you mention it!',
            backgroundImage: getUrl('givecamp.png')
        });
    }

    function CreateCurrentItems(items) {
        items.push({
            group: pageData.groups[1],
            key: 'backlog3',
            title: 'SydJS',
            subtitle: 'Talk about WinJS',
            backgroundImage: getUrl('sydjs.png'),
        });
    }

    function CreateCompletedItems(items) {
        items.push({
            group: pageData.groups[2],
            key: 'backlog3',
            title: 'SydJS',
            subtitle: 'Prepare talk',
            backgroundImage: getUrl('sydjs.png'),
        });

        for (var i = 4; i < 10; i++) {
            items.push({
                group: pageData.groups[2],
                key: 'backlog' + i,
                title: 'SydJS',
                subtitle: 'Have a beer',
                backgroundImage: getUrl('beer.jpg'),
            });
        }

        for (var i = 10; i < 14; i++) {
            items.push({
                group: pageData.groups[2],
                key: 'backlog' + i,
                title: 'SydJS',
                subtitle: 'Have some pizza',
                backgroundImage: getUrl('pizza.jpg'),
            });
        }
    }

    var pageData = {};
    pageData.groups = getGroups();
    pageData.items = getItems();

    WinJS.Namespace.define('landingPage', {
        fragmentLoad: fragmentLoad,
        itemInvoked: itemInvoked,
    });
})();
