(function () {
    'use strict';

    // Custom event raised after the fragment is appended to the DOM.
    WinJS.Application.addEventListener('fragmentappended', function handler(e) {
        if (e.location === '/html/detailPage.html') { fragmentLoad(e.fragment, e.state); }
    });

    function fragmentLoad(elements, options) {
        var item = options && options.item ? options.item : getItem();
        elements.querySelector('.pageTitle').textContent = item.group.title;

        WinJS.UI.processAll(elements)
            .then(function () {
            elements.querySelector('#title').value = item.title;
            elements.querySelector('#subtitle').value = item.subtitle;
            elements.querySelector('#image').style.backgroundImage = item.backgroundImage;
            
        });
    }

    WinJS.Namespace.define('detailPage', {
        fragmentLoad: fragmentLoad,
    });
})();
