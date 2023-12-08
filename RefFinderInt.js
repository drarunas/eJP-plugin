function RefFinder() {
    //var titleHeader = Array.from(document.querySelectorAll("th")).find(cell => cell.textContent.includes("Title"));
    var titleHeader = Array.from(document.querySelectorAll("th")).find(
        (cell) => cell.textContent.trim() === "Title"
    );

    if (titleHeader) {
        var titleCell = titleHeader.nextElementSibling;
        var MStitle = titleCell.textContent.trim();
    }

    //var abstractHeader = Array.from(document.querySelectorAll("th")).find(cell => cell.textContent.includes("Abstract"));
    var abstractHeader = Array.from(document.querySelectorAll("th")).find(
        (cell) => cell.textContent.trim() === "Abstract"
    );

    if (abstractHeader) {
        var abstractCell = abstractHeader.nextElementSibling;
        var MSabstract = abstractCell.textContent.trim();
    }

    var correspondingHeader = Array.from(document.querySelectorAll("th")).find(
        function (th) {
            return th.textContent === "Corresponding Author";
        }
    );
    var contributingHeader = Array.from(document.querySelectorAll("th")).find(
        (cell) => cell.textContent.includes("Contributing Author")
    );

    var names = [];
    if (correspondingHeader !== undefined) {
        var correspondingCell = correspondingHeader.nextElementSibling;
        var cellText = correspondingCell.textContent;
        cellText = cellText.replace(/\(([^)]+)\)/g, ""); // Remove anything in parentheses
        cellText = cellText.replace(/Dr\.?|Professor|Mr\.?|Ms\.?/gi, ""); // Remove titles
        names.push(cellText.trim());
    }

    if (contributingHeader !== undefined) {
        var contributingCell = contributingHeader.nextElementSibling;
        var cellText = contributingCell.textContent;
        cellText = cellText.replace(/\(([^)]+)\)/g, ""); // Remove anything in parentheses
        cellText = cellText.replace(/Dr\.?|Professor|Mr\.?|Ms\.?/gi, ""); // Remove titles
        var contributingNames = cellText.trim().split(/\s*,\s*/);
        names.push(...contributingNames);
    }

    // Create a button element
    const button = document.createElement("input");
    button.type = "button";
    button.value = "Reviewer Finder";
    button.classList.add("Triage");

    // Add a click event listener to the button
    button.addEventListener("click", () => {
        // Send a message to the background page to open a new tab
        chrome.runtime.sendMessage({
            action: "open_tab",
            title: MStitle,
            abstract: MSabstract,
            authors: names
        });
    });

    var briefTable = document.getElementById("ms_brief_table");
    if (briefTable) {
        briefTable.parentNode.insertBefore(button, briefTable.nextSibling);
        var newLine = document.createElement("br");
        //briefTable.parentNode.insertBefore(newLine, briefTable.nextSibling);
    } else {
        console.log("Couldn't find the ms_brief_table table.");
    }

    // Add a message listener to handle messages from the background page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "insert_text") {
        var textareaTitle = document.getElementById("paper_title");
        var textareaAbstract = document.getElementById("paper_abstract");
        var textareaAuthors = document.getElementById("paper_authors");
        var submitButton = document.getElementById("manuscript_search_submit");

        if (textareaTitle && textareaAbstract && textareaAuthors) {
            textareaTitle.value = message.title;
            textareaAbstract.value = message.abstract;
            textareaAuthors.value = message.authors;

            // Enable the submit button
            if (submitButton) {
                submitButton.disabled = false;

                // Simulate a click event on the submit button
                var clickEvent = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': true
                });
                submitButton.dispatchEvent(clickEvent);
            } else {
                console.error('Submit button not found.');
            }
        } else {
            console.error('One or more textareas not found.');
        }
    }
});

}
