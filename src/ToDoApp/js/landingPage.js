(function () {
    'use strict';

    var listRenderer;
    var headerRenderer;
    var itemRenderer;
    var pageLayout;

    // Custom event raised after the fragment is appended to the DOM.
    WinJS.Application.addEventListener('fragmentappended', function handler(e) {
        if (e.location === '/html/landingPage.html') { fragmentLoad(e.fragment, e.state); }
    });

    function updateForLayout(lv, layout) {
        pageLayout = layout;
        if (pageLayout === Windows.UI.ViewManagement.ApplicationLayoutState.snapped) {
            WinJS.UI.setOptions(lv, {
                dataSource: pageData.groups,
                itemRenderer: listRenderer,
                groupDataSource: null,
                groupRenderer: null,
                oniteminvoked: itemInvoked
            });

            lv.layout = new WinJS.UI.ListLayout();
        } else {
            var groupDataSource = new WinJS.UI.GroupDataSource(
                    new WinJS.UI.ListDataSource(pageData.groups), function (item) {
                return {
                    key: item.data.group.key,
                    data: {
                        title: item.data.group.title,
                        click: function () {
                            WinJS.Navigation.navigate('/html/collectionPage.html', { group: item.data.group });
                        }
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
        lv.refresh();
    }

    function layoutChanged(e) {
        var list = document.querySelector('.landingList');
        if (list) {
            var lv = WinJS.UI.getControl(list);
            updateForLayout(lv, e.layout);
        }
    }

    function fragmentLoad(elements, options) {
        try {
            var appLayout = Windows.UI.ViewManagement.ApplicationLayout.getForCurrentView();
            if (appLayout) {
                appLayout.addEventListener('layoutchanged', layoutChanged);
            }
        } catch (e) { }

        WinJS.UI.processAll(elements)
            .then(function () {
            itemRenderer = elements.querySelector('.itemTemplate');
            headerRenderer = elements.querySelector('.headerTemplate');
            listRenderer = elements.querySelector('.listTemplate');
            var lv = WinJS.UI.getControl(elements.querySelector('.landingList'));
            updateForLayout(lv, Windows.UI.ViewManagement.ApplicationLayout.value);
        });
    }

    function itemInvoked(e) {
        if (pageLayout === Windows.UI.ViewManagement.ApplicationLayoutState.snapped) {
            var group = pageData.groups[e.detail.itemIndex];
            WinJS.Navigation.navigate('/html/collectionPage.html', { group: group });
        } else {
            var item = pageData.items[e.detail.itemIndex];
            WinJS.Navigation.navigate('/html/detailPage.html', { item: item });
        }
    }

    function getGroups() {
        var colors = ['rgba(209, 211, 212, 1)', 'rgba(147, 149, 152, 1)', 'rgba(65, 64, 66, 1)'];
        var groups = [];

        groups.push({
            key: 'group1',
            title: 'Backlog',
            label: 'Tasks I haven\'t started',
            description: 'Just a random collection of things I need to do',
            //fullDescription: 'Ǻ Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum.' + (even ? '' : ' Ǻ Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum.'),
            backgroundColor: colors[0]
        });

        groups.push({
            key: 'group2',
            title: 'In Progress',
            label: 'Tasks that are underway',
            description: 'What I\'m doing currently',
            //fullDescription: 'Ǻ Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum.' + (even ? '' : ' Ǻ Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum.'),
            backgroundColor: colors[1]
        });

        groups.push({
            key: 'group3',
            title: 'Done',
            label: 'Tasks that are completed',
            description: 'Look at how awesome I am',
            //fullDescription: 'Ǻ Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum.' + (even ? '' : ' Ǻ Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum.'),
            backgroundColor: colors[2]
        });
        return groups;
    }

    function getItems() {
        var colors = ['rgba(209, 211, 212, 1)', 'rgba(147, 149, 152, 1)', 'rgba(65, 64, 66, 1)'];
        var items = [];

        CreateMockBacklog(items);
        CreateCurrentItems(items);
        CreateCompletedItems(items);

        return items;
    }

    function CreateMockBacklog(items) {
        var category = pageData.groups[0];

        items.push({
            group: category,
            key: 'backlog1',
            title: 'Code52',
            subtitle: 'Ensure that you mention Code52 man!',
            backgroundImage: 'url(/images/items/code52.png)',
        });
        items.push({
            group: category,
            key: 'backlog2',
            title: 'GiveCamp',
            subtitle: 'Ensure that you mention Givecamp!',
            backgroundImage: 'url(/images/items/givecamp.png)'
        });
    }

    function CreateCurrentItems(items) {
        var category = pageData.groups[1];
        items.push({
            group: category,
            key: 'backlog3',
            title: 'SydJS',
            subtitle: 'Talk about WinJS',
            backgroundImage: 'url(/images/items/sydjs.png)',
        });

        for (var i = 4; i < 10; i++) {
            items.push({
                group: category,
                key: 'backlog' + i,
                title: 'SydJS',
                subtitle: 'Have a beer',
                backgroundImage: 'url(/images/items/beer.jpg)',
            });
        }
    }

    function CreateCompletedItems(items) {
        var category = pageData.groups[2];
        items.push({
            group: category,
            key: 'backlog3',
            title: 'SydJS',
            subtitle: 'Prepare talk',
            backgroundImage: 'url(/images/items/sydjs.png)',
        });
    }

    var pageData = {};
    pageData.groups = getGroups();
    pageData.items = getItems();

    WinJS.Namespace.define('landingPage', {
        fragmentLoad: fragmentLoad,
        itemInvoked: itemInvoked
    });
})();
