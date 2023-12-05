$(document).ready(function () {
    // Retrieve the saved width from local storage
    chrome.storage.local.get(["tableWidth"], function (result) {
        var width = result.tableWidth;

        // Check the checkbox based on the saved width value
        if (width === "100%") {
            $("#widthCheckbox").prop("checked", true);
        } else {
            $("#widthCheckbox").prop("checked", false);
        }
    });

    // Handle checkbox change event
    $("#widthCheckbox").change(function () {
        var width = $(this).is(":checked") ? "100%" : "756px";

        // Save the width value to local storage
        chrome.storage.local.set({ tableWidth: width });

        // Send message to tabs with URLs containing "nature.com"
        chrome.tabs.query(
            { url: "*://*.mts-nathumbehav.nature.com/*" },
            function (tabs) {
                tabs.forEach(function (tab) {
                    chrome.tabs.sendMessage(tab.id, { tableWidth: width });
                });
            }
        );
    });
});
