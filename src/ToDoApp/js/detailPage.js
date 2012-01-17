(function () {
    'use strict';

    var currentItem;

    // Custom event raised after the fragment is appended to the DOM.
    WinJS.Application.addEventListener('fragmentappended', function handler(e) {
        if (e.location === '/html/detailPage.html') { fragmentLoad(e.fragment, e.state); }
    });

    function fragmentLoad(elements, options) {
        currentItem = options.item;
        elements.querySelector('.pageTitle').textContent = currentItem.group.title;

        WinJS.UI.processAll(elements)
            .then(function () {
            elements.querySelector('#title').value = currentItem.title;
            elements.querySelector('#subtitle').value = currentItem.subtitle;
            elements.querySelector('#image').style.backgroundImage = currentItem.backgroundImage;
            
            WinJS.UI.process(document.getElementById('appbar'))
                .then(function () {
                document.getElementById('save').addEventListener('click', saveItem, false);
                document.getElementById("open").addEventListener('click', openFile, false);
                document.getElementById("capture").addEventListener('click', captureImage, false);
            });
        });
    }

    function saveItem() {
        WinJS.Navigation.back(1);
    }

    function openFile() {
        var openPicker = new Windows.Storage.Pickers.FileOpenPicker();
        openPicker.viewMode = Windows.Storage.Pickers.PickerViewMode.thumbnail;
        openPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
        openPicker.fileTypeFilter.replaceAll([".png", ".jpg", ".jpeg"]);

        openPicker.pickSingleFileAsync().then(function (file) {
            if (file) {
                // TODO: write the file access
            } else {
                //sdkSample.displayStatus("File was not returned");
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
                    // sdkSample.displayStatus("");
                    //var scenario1BlobUrl = URL.createObjectURL(file);
                    //id("scenario1ImageHolder1").src = scenario1BlobUrl;
                    //photoFile = file.path;

                    //// Show status
                    //scenario1ActionsChangeVisibility("visible");
                } else {
                    // sdkSample.displayStatus("No photo captured.");
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
