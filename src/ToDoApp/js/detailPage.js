(function () {
    'use strict';

    var currentItem;

    // Custom event raised after the fragment is appended to the DOM.
    WinJS.Application.addEventListener('fragmentappended', function handler(e) {
        if (e.location === '/html/detailPage.html') { fragmentLoad(e.fragment, e.state); }
    });

    // shortcut functions - yes, you *could* use jQuery here
    function getById(id) {
        return document.getElementById(id);
    }

    function attach(id, callback) {
        getById(id).addEventListener('click', callback, false);
    }

    function fragmentLoad(elements, options) {
        currentItem = options.item;
        elements.querySelector('.pageTitle').textContent = currentItem.group.title;

        WinJS.UI.processAll(elements)
            .then(function () {
            getById('title').value = currentItem.title; // TODO: use the WinJS bindings?
            getById('subtitle').value = currentItem.subtitle;

            attach('save', saveItem); // attach event handlers
            attach('open', openFile);
            attach('catpure', captureImage);
        });
    }

    function saveItem() {
        currentItem.title = getById('title').value;
        currentItem.subtitle = getById('subtitle').value;

        WinJS.Navigation.back(1); // return to previous page
    }

    function openFile() {
        var openPicker = new Windows.Storage.Pickers.FileOpenPicker();
        openPicker.viewMode = Windows.Storage.Pickers.PickerViewMode.thumbnail;
        openPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
        openPicker.fileTypeFilter.replaceAll([".png", ".jpg", ".jpeg"]);

        openPicker.pickSingleFileAsync().then(function (file) {
            if (file) {
                // TODO: display the file on the main page
            } else {
                // TODO: handle the user cancelling
            }
        });
    }

    function captureImage() {
        try {
            var mode = Windows.Media.Capture.CameraCaptureUIMode.photo;

            var dialog = new Windows.Media.Capture.CameraCaptureUI();
            dialog.photoSettings.croppedAspectRatio = { width: 16, height: 9 };
            dialog.captureFileAsync(mode).then(function (file) {
                if (file) {
                    // TODO: attach the file to the item
                } else {
                    // TODO: handle the user cancelling
                }
            }, function (err) {
                console.log(err);
            });
        } catch (err) {
            console.log(err);
        }
    }

    WinJS.Namespace.define('detailPage', {
        fragmentLoad: fragmentLoad,
    });
})();
