$(document).ready(function () {
    var today = new Date();

    $(".folder_table table tbody tr").each(function () {
        var hasPendingText =
            $(this)
                .find("td")
                .filter(function () {
                    return $(this).text().trim() === "pending";
                }).length > 0;

        if (hasPendingText) {
            var dueDateText = $(this).find("td:eq(1)").text();

            var dueDateParts = dueDateText.split(" ");
            var day = parseInt(dueDateParts[0].replace(/\D/g, ""));

            var month = getMonthIndex(dueDateParts[1]);
            var year = parseInt("20" + dueDateParts[2]);
            var dueDateFormatted = new Date(year, month, day);

            if (dueDateFormatted < today) {
                $(this).addClass('pending');
            }
        }
    });
});

function getMonthIndex(month) {
    var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "Septempber",
        "October",
        "November",
        "December"
    ];

    return months.indexOf(month);
}


$(document).ready(function () {
    $('.folder_table td:contains("Waiting for")').css(
        "background-color",
        "#bef7c0"
    );
    $('.folder_table td:contains("Initial QC Started")').css(
        "background-color",
        "#f9ffe6"
    );
    $('.folder_table td:contains("All Reviewers Assigned")').css(
        "background-color",
        "#ffdee8"
    );
    $('.folder_table td:contains("Potential Reviewers Assigned")').css(
        "background-color",
        "#e85a69"
    );
    $('.folder_table td:contains("Editor Decision Started")').css(
        "background-color",
        "#f2e5b3"
    );
    $('table td:has(img[src="/images/folder_closed.gif"])')
        .find("img")
        .remove();
    $('table:has(td:contains("Editor Tasks"))').css("border-spacing", "2px");
    $('table:has(td:contains("Editor Tasks"))').css("border-spacing", "2px");

    $('.folder_table:has(td:contains("Primary Sort"))').remove();

    $(".folder_table tbody tr:first-child").each(function () {
        $(this)
            .closest("table")
            .prepend("<thead></thead>")
            .children("thead")
            .append($(this).remove());
    });

    $(".folder_row_even").removeClass("folder_row_even");
    $(".folder_row_odd").removeClass("folder_row_odd");

    
    //// Setup - add a text input to each footer cell
//$('.folder_table')
  //.children('thead')
  //.filter(function() {
    //return $(this).parent().is('.folder_table');
  //})
  //.append(
    //$('.folder_table thead .folder_row_header')
    //  .clone(true)
    //  .addClass('filters')
  //);
    
    $(".folder_table").DataTable({
        pageLength: 50,
        stateSave: true
    });

    $('th:contains("Remarks to the Editor")').closest('table').addClass('refRec');
    $('b:contains("Circulation Comments")').siblings('table').addClass('refRec');

    $("span.BODY").each(function () {
        var text = $(this).text().trim();
        var pattern = /^\d+ PE$/;

        if (pattern.test(text)) {
            $(this).css({
                color: "#d11b7f",
                "font-weight": "bold"
            });
        }
    });

    $(".contact_pot_revs_table tbody tr:first-child").each(function () {
        $(this)
            .closest("table")
            .prepend("<thead></thead>")
            .children("thead")
            .append($(this).remove());
    });
    $(".contact_pot_revs_table").DataTable({ pageLength: 50 });

    $(".folder_table").each(function () {
        var table = $(this).DataTable();

        table
            .on("draw", function () {
                table
                    .column(0, { search: "applied", order: "applied" })
                    .nodes()
                    .each(function (cell, i) {
                        cell.innerHTML = i + 1;
                    });
            })
            .draw(false);
    });
});

// UI to change font sizes on eJP, all elements except tabs and sticky notes
$(document).ready(function () {
    var currentFontSize = localStorage.getItem("fontSize") || 15; // Get the font size from localStorage or use a default value

    // Create Increase Font Size button dynamically
    var increaseFontBtn = $("<button>", {
        id: "increaseFontBtn",
        text: "+",
        css: {
            width: "30px",
            height: "30px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#7180ad",
            color: "#fff",
            margin: "2px"
        }
    });

    increaseFontBtn.click(function () {
        currentFontSize++;
        $("*").css("font-size", currentFontSize + "px");
        //$('*').css('font-size', currentFontSize + 'px !important'); // Apply the new font size with !important
        localStorage.setItem("fontSize", currentFontSize); // Store the updated font size in localStorage
    });

    // Create Decrease Font Size button dynamically
    var decreaseFontBtn = $("<button>", {
        id: "decreaseFontBtn",
        text: " -",
        css: {
            width: "30px",
            height: "30px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#7180ad",
            color: "#fff",
            margin: "2px"
        }
    });

    decreaseFontBtn.click(function () {
        currentFontSize--;
        $("*").css("font-size", currentFontSize + "px");
        //  $('*').css('font-size', currentFontSize + 'px !important'); // Apply the new font size with !important
        localStorage.setItem("fontSize", currentFontSize); // Store the updated font size in localStorage
    });

    // Create a new <tr> element
    var buttonsRow = $("<tr>");

    // Create a <td> element for the Increase Font Size button
    var increaseFontTd = $("<td>", {
        css: {
            backgroundColor: "#63b1c7"
        }
    }).append(increaseFontBtn);

    // Create a <td> element for the Decrease Font Size button
    var decreaseFontTd = $("<td>", {
        css: {
            backgroundColor: "#63b1c7"
        }
    }).append(decreaseFontBtn);

    // Append the Increase and Decrease Font Size <td> elements to the new row
    buttonsRow.append(increaseFontTd, decreaseFontTd);

    // Prepend the new row to the table row with class "navdk"
    $("tr.navdk").prepend(buttonsRow);

    // Set the font size on page load
    $("*:not(.stickynote)").css("font-size", currentFontSize + "px");
});

// set table width, controlled from popup.js:

$(document).ready(function () {
    chrome.storage.local.get(["tableWidth"], function (result) {
        var width = result.tableWidth;

        // Apply the table width on page load
        applyTableWidth(width);
    });

    // Listen for messages from popup.js
    chrome.runtime.onMessage.addListener(function (
        request,
        sender,
        sendResponse
    ) {
        if (request.tableWidth) {
            applyTableWidth(request.tableWidth);
        }
    });
});

function applyTableWidth(width) {
    $(
        "table:not(#apy_b0div table):not(table.dataTable table):not(.tabPage table)"
    ).css("width", width);
    $("table.dataTable table").css("width", "100% !important");
}

// BRING PAPERS TO TRIAGE IN OUR FORMAT

// Define a function to construct the message with the desired table values
function buildMessage() {
    // Find the header cells containing the desired text
    var msHeader = Array.from(document.querySelectorAll("th")).find((cell) =>
        cell.textContent.includes("Manuscript #")
    );
    var submissionHeader = Array.from(document.querySelectorAll("th")).find(
        (cell) => cell.textContent.includes("Submission Date")
    );
   var titleHeader = Array.from(document.querySelectorAll("th")).find(
        (cell) => cell.textContent.trim() === "Title"
    );
    var abstractHeader = Array.from(document.querySelectorAll("th")).find(
        (cell) => cell.textContent.trim() === "Abstract"
    );

    // Get the editors string
    var editorsHeader = Array.from(document.querySelectorAll("th")).find(
        (cell) => cell.textContent.includes("Primary / Secondary Editors")
    );
    var editors = editorsHeader.nextElementSibling.textContent;

    // Replace names with initials
    var replacements = {
        Radzvilavicius: "AR",
        Bradshaw: "AB",
        Payne: "CP",
        Horder: "JH",
        Kousta: "SK",
        Wang: "XW",
        Antusch: "SA",
        Ariani: "GA"
    };
    var regex = new RegExp(Object.keys(replacements).join("|"), "gi");
    editors = editors
        .replace(/(Dr|Mr|Ms)\.?/g, "")
        .replace(regex, (match) => replacements[match]);

    // Extract last names and join with "/"
    editors = editors
        .split("/")
        .map((name) => name.trim().split(" ").pop())
        .join("/");

    // Build the message string, including the desired cell values if they were found
    var message = "<b>Editors:</b> " + editors + "<br>";
    if (msHeader) {
        var msCell = msHeader.nextElementSibling;
        message += "<b>MS#:</b> " + msCell.textContent.trim() + "<br>";
    }
    if (submissionHeader) {
        var submissionCell = submissionHeader.nextElementSibling;
        var submissionDate = new Date(submissionCell.textContent);
        var daysOld = Math.round(
            (new Date() - submissionDate) / (1000 * 60 * 60 * 24)
        );
        message +=
            "<b>Submission date (or days old): </b>" +
            submissionCell.textContent.trim() +
            " " +
            daysOld +
            " days ago<br>";
    }
    if (titleHeader) {
        var titleCell = titleHeader.nextElementSibling;
        message += "<b>Title: </b>" + titleCell.textContent.trim() + "<br>";
    }
    if (abstractHeader) {
        var abstractCell = abstractHeader.nextElementSibling;
        message += "<b>Abstract:</b><br>" + abstractCell.textContent.trim() + "<br>";
    }

    message += "<b>Important notes:</b> <br>";
    message += "<b>References: </b><br>";

    // If at least one of the desired values was found, copy the message to the clipboard and display a confirmation alert
    if (message !== "Editors:\n") {
  // Create a hidden div element to hold the formatted text
  const div = document.createElement('div');
  message = `<span style="font-size: 11pt; line-height:1.15;">${message}</span>`;
  div.innerHTML = message;
  div.style.opacity = 0;
  div.style.position = 'fixed';
  div.style.pointerEvents = 'none';

  // Append the div to the document body
  document.body.appendChild(div);

  // Create a range and select the contents of the div
  const range = document.createRange();
  range.selectNodeContents(div);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  // Copy the selected text to the clipboard
  document.execCommand('copy');
             alert(
                    "The following message has been copied to your clipboard:\n\n" +
                        message
                );

  // Clean up: remove the div and clear the selection
  document.body.removeChild(div);
  selection.removeAllRanges();
  //      navigator.clipboard.writeText(message).then(
  //          function () {
  //              alert(
  //                  "The following message has been copied to your clipboard:\n\n" +
  //                      message
  //              );
  //          },
  //          function () {
  //              alert(
  //                  "Oops! Something went wrong while copying the message to your clipboard."
  //              );
  //          }
  //      );
    } else {
        alert("Sorry, none of the desired values were found in the table.");
    }
}

// Add the "Triage" button after the "ms_brief_table" table
var briefTable = document.getElementById("ms_brief_table");
if (briefTable) {
    var button = document.createElement("input");
    button.type = "button";
    button.value = "Triage";
    button.onclick = buildMessage;
    button.classList.add("Triage");

    briefTable.parentNode.insertBefore(button, briefTable.nextSibling);
} else {
    console.log("Couldn't find the ms_brief_table table.");
}

// TRIAGE DONE

// COPY A GS REVIEWER SEARCH STRING TO CLIPBOARD:
function searchForReviewers() {
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
    var formattedNames = 'author:" "';
    if (names.length > 1) {
        formattedNames +=
            " AND (" +
            names
                .slice(0)
                .map(function (name) {
                    return 'author:"' + name + '"';
                })
                .join(" OR ") +
            ")";
    }
    console.log(formattedNames);

    // Copy formatted names to clipboard
    navigator.clipboard
        .writeText(formattedNames)
        .then(() => {
            // Display alert if copy was successful
            alert(
                "Formatted reviewer search string copied to clipboard:\n" +
                    formattedNames
            );
        })
        .catch(() => {
            // Display error message if copy failed
            alert("Failed to copy formatted names to clipboard");
        });
}

var briefTable = document.getElementById("ms_brief_table");
if (briefTable) {
    var button = document.createElement("input");
    button.type = "button";
    button.value = "GS Reviewer Search";
    button.classList.add("Triage");
    button.onclick = searchForReviewers;
    briefTable.parentNode.insertBefore(button, briefTable.nextSibling);
}

// DONE GS REVIEWER SEARCH

//RTAs

function insertButton_SciRep() {
    var decision = document.querySelector(
        "select[name='EvalCdeOverall Rating|10003']"
    );
    if (decision) {
        var button = document.createElement("input");
        button.type = "button";
        button.value = "RTA Sci Rep";
        button.classList.add("Triage");
        decision.parentNode.insertBefore(button, decision.nextSibling);
        button.addEventListener("click", function () {
            var remarksTextArea = document.querySelector(
                "textarea[name='Remarks to Editor|10004']"
            );
            if (remarksTextArea) {
                remarksTextArea.value =
                    "Specialist contribution\n" + remarksTextArea.value;
            }

            var selectInput = document.querySelector(
                "select[name='EvalCdeOverall Rating|10003']"
            );
            if (selectInput) {
                var rejectOption = selectInput.querySelector(
                    "option[value='4=1|Reject']"
                );
                if (rejectOption) {
                    rejectOption.selected = true;
                }
            }

            var transferOptionSelect = document.querySelector("#transfer_option");
            if (transferOptionSelect) {
                var transferOption =
                    transferOptionSelect.querySelector("option[value='1-1-1']");
                if (transferOption) {
                    transferOption.selected = true;
                }
            }

            var transferJournalSelect = document.querySelector("#transfer_journal_name");
            if (transferJournalSelect) {
                var scientificReportsOption =
                    transferJournalSelect.querySelector(
                        "option[value='Scientific Reports']"
                    );
                if (scientificReportsOption) {
                    scientificReportsOption.selected = true;
                }
            }

            var templateSelect = document.querySelector("select[name='template']");
            if (templateSelect) {
                var templateOption = templateSelect.querySelector(
                    "option[value='nathumbehav_decision_rta_nr_transfer.txt']"
                );
                if (templateOption) {
                    templateOption.selected = true;
                }
            }

            var changeLetterInput = document.querySelector(
                "input[name='change_letter']"
            );
            if (changeLetterInput) {
                changeLetterInput.click();
            }
        });
    }
}


insertButton_SciRep();



function insertButton_letter() {
    var msgTextArea = document.querySelector("textarea[name='1_msg_txt']");
    var msgSubInput = document.querySelector("input[name='msg_sub']");
    if (msgTextArea && msgSubInput) {
        var button = document.createElement("input");
        button.type = "button";
        button.value = "RTA basic";
        button.classList.add("Triage");

        msgSubInput.parentNode.insertBefore(button, msgSubInput);

        button.addEventListener("click", function () {
            if (msgTextArea.value.trim() !== "") {
                var lines = msgTextArea.value.split("\n");
                if (lines.length >= 9) {
                    lines[6] =
                        "After careful consideration, I regret that we cannot offer to publish this work in Nature Human Behaviour. While we appreciate your study, we are not persuaded that the insights that arise from this work represent a development of sufficiently broad scientific impact to warrant publication in Nature Human Behaviour.";
                    msgTextArea.value = lines.join("\n");
                }
            }
        });
    }
}

insertButton_letter();

// DONE RTA's

//REF FINDER INTEGRATION

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
            var textarea = document.getElementById("paper_title");
            if (textarea) {
                textarea.value = message.title;
            } else {
                console.error('Textarea with id "paper_title" not found.');
            }
            textarea = document.getElementById("paper_abstract");
            if (textarea) {
                textarea.value = message.abstract;
            } else {
                console.error('Textarea with id "paper_abstract" not found.');
            }
            textarea = document.getElementById("paper_authors");
            if (textarea) {
                textarea.value = message.authors;
            } else {
                console.error('Textarea with id "paper_authors" not found.');
            }
        }
    });
}

RefFinder();

function AddRefs() {
    // Add reviewers from Finder to eJP
    //Add listener if the eJP ref finding page is loaded:
    if (
        window.location.href.includes("mts-nathumbehav.nature.com") &&
        document.querySelector('input[value="Search Google Scholar"]') &&
        document.querySelector('input[value="Search Double Medline"]')
    ) {
        chrome.runtime.onMessage.addListener(
            (message, sender, sendResponse) => {
                if (message.action === "Add Ref") {
                    document.getElementById("input_fname").value =
                        message.fname;
                    document.getElementById("input_lname").value =
                        message.lname;
                    document.getElementById("input_email").value =
                        message.email;
                    document.getElementById("input_org").value = message.org;
                }
            }
        );
    }

    if (window.location.href.includes("reviewerfinder.nature.com/finder")) {
        const col12Elements = document.querySelectorAll(".author_info_panel");
        col12Elements.forEach((el) => {
            const input = document.createElement("input");
            input.type = "button";
            input.value = "To eJP";
            input.style.padding = "5px 10px";
            input.style.fontWeight = "bold";
            input.classList.add(
                "edit_update_button",
                "submit-btn",
                "btn",
                "button-cta",
                "btn-primary"
            );
            el.appendChild(input);

            input.addEventListener("click", (event) => {
                var email =
                    event.target.parentNode.querySelector(".email_value");
                var name = event.target.parentNode.querySelector(".name");
                var nameArray = name.textContent.split(", ");
                var lname = nameArray[0];
                var fname = nameArray[1];
                var org = event.target.parentNode.querySelector(".affiliation");
                chrome.runtime.sendMessage({
                    action: "Add Ref",
                    email: email.textContent,
                    fname: fname,
                    lname: lname,
                    org: org.textContent
                });
            });
        });
    }
}
AddRefs();

// DONE REF FINDER INTEGRATION

function Recommendations() {
    // Find all 'b' elements on the page that contain the text 'Evaluations'
    const evaluationsElements = document.querySelectorAll("b");
    const evaluationsElement = Array.from(evaluationsElements).find((elem) => {
        return elem.innerText.includes("Evaluations");
    });

    const templateElements = document.querySelectorAll("b");
    const templateElement = Array.from(evaluationsElements).find((elem) => {
        return elem.innerText.includes("Template Letter");
    });

    // Check if the 'Evaluations' element is present on the page
    if (evaluationsElement && templateElement) {
        // Find the table that follows the 'Evaluations' element
        const evaluationsTable = evaluationsElement.nextElementSibling;

        // Get all the header cells in the table
        const headerCells = evaluationsTable.querySelectorAll("th");

        // Filter out the header cells that contain the words 'Reviewer', 'Role', and 'Opt in to', as well as empty headers
        const filteredHeaderCells = Array.from(headerCells).filter((cell) => {
            const cellText = cell.textContent.toLowerCase();
            return (
                cellText.trim() !== "" &&
                !cellText.includes("reviewer") &&
                !cellText.includes("role") &&
                !cellText.includes("opt in to")
            );
        });

        // Extract the names from the filtered header cells
        const names = filteredHeaderCells.map((cell) => {
            return cell.textContent.trim();
        });

        // Now you can use the 'names' array to generate your template
        // Generate the block of text
        let textBlock = `Recommendation:\n\n\n`;
        names.forEach((name, index) => {
            textBlock += `R${index + 1} ${name} (expertise)\n\n\n`;
        });
        textBlock += `\n\n\nEvaluation:`;

        const textarea = document.getElementById(
            "circulation_comment_to_other_editors"
        );

        // Create the button element
        const button = document.createElement("input");
        button.type = "button";
        button.value = "Insert Recommendation Template";
        button.classList.add("Triage");

        // Add a click event listener to the button
        button.addEventListener("click", () => {
            // Insert the generated text into the textarea
            textarea.value += textBlock;
        });

        // Insert the button element above the textarea
        textarea.parentNode.insertBefore(button, textarea);

        var newLine = document.createElement("br");

        // Insert the new line element before the textarea
        textarea.parentNode.insertBefore(newLine, textarea);
    }
}

Recommendations();

// Find the <link> element with the specified href attribute
var linkElement = document.querySelector(
    'link[href="https://mts-nathumbehav.nature.com/html/style.css"]'
);

// Check if the element exists before removing it
if (linkElement) {
    linkElement.remove();
}

function loadRobotoFont() {
    // Create a <link> element to import the Roboto font from Google Fonts
    var linkElement = document.createElement("link");
    linkElement.href =
        "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap";
    linkElement.rel = "stylesheet";

    // Append the <link> element to the document's <head>
    document.head.appendChild(linkElement);
}

// Execute the font loading function
loadRobotoFont();


let OTRTemplate =
`Ethics approval/waiver:                                                        _
Permission to use secondary datasets:                            _
Privacy or consent issues (for secondary datasets):      _
Sensitive topic:                                                                       _
Ethics review needed:                                                           _  
Signed comments needed:                                                  _
Data availability restrictions:                                               _
Code availability restrictions:                                              _
Code peer review needed:                                                    _
Statistics: 
a.       Main result is null:                                                        _
b.       Significance is declared at .1:                                     _
c.       BF between 0.33 and 3 interpreted as evidence supporting (null) hypothesis
Clinical trial:                                                                             _
Preregistration issues:                                                           _
Competing interests:                                                              _
Double-blind peer review:                                                       _
Acknowledged individuals:                                                    _

SRMA:
PRISMA flowchart included in ms                     
PRISMA checklist (or other appropriate checklist)   

Resource:
Manuscript includes meaningful use case?            

Registered Reports:
Is the RR confirmatory?                             
Are hypotheses and predictions clearly stated?      
Is Design Table present?                            
For RRs using NHST: 
does the study meet power requirements (at least 95%)? 
is the power analysis based on the smallest meaningful effect size (rather than on pilot data or single prior study)? 
For RRs using Bayesian inference: 
do AUs commit to collecting data until BF=10?           
if AUs specify a maximal N of participants, is that sufficiently large to provide meaningful conclusions even if BF =10 is not reached? 
Pilot data needed? (Required for studies using novel designs/testing novel hypotheses) 
For RRs with primary data:
Have the authors already started data collection?                  
Do the authors have a fixed timeline for starting data collection? `;

// OTR Template
var textareaElement = document.querySelector('textarea[name="circulation_comment_to_other_editors"]');
if (textareaElement) {
    var button = document.createElement("input");
    button.type = "button";
    button.value = "OTR template";
    button.onclick = function () {
        textareaElement.value += OTRTemplate;
    };
    button.classList.add("AddTemplateText");

    textareaElement.parentNode.insertBefore(button, textareaElement);
    var lineBreak = document.createElement("br");
    textareaElement.parentNode.insertBefore(lineBreak, button.nextSibling);
} else {
    console.log("Couldn't find the specified textarea element.");
}



