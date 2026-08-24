/**
 * Google Apps Script backing the Elite Health Club booking form.
 *
 * SETUP
 *   1. Sheet > Extensions > Apps Script, replace all code with this file, Save.
 *   2. Run setupSheet() once from the editor (adds the header row).
 *   3. Deploy > Manage deployments > edit the EXISTING deployment >
 *      Version: "New version" > Deploy.  This keeps the same /exec URL.
 *
 * Editing and saving this file does NOT update the live web app —
 * you must deploy a new version.
 */

// The tab that receives submissions. Targeted by name so reordering or
// adding tabs can't silently redirect writes to the wrong sheet.
var SHEET_NAME = "Elite-health-club";

var HEADERS = [
  "Received At",
  "Name",
  "Email",
  "Phone",
  "Interest",
  "Message",
  "Submitted At",
  "Source",
];

// 1-based indexes into HEADERS for the columns needing explicit formatting.
var RECEIVED_AT_COLUMN = 1;
var PHONE_COLUMN = 4;

// Sortable and unambiguous, and keeps the time visible. Sheets otherwise
// auto-picks a date-only format for cells it hasn't seen before.
var TIMESTAMP_FORMAT = "yyyy-mm-dd hh:mm:ss";

/** Run this once from the Apps Script editor to add the header row. */
function setupSheet() {
  var sheet = getSheet();
  sheet.insertRowBefore(1);
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  sheet.setFrozenRows(1);

  var dataRows = sheet.getMaxRows() - 1;

  // Phone must stay plain text. Sheets reads a leading "+" as the start of a
  // formula, so "+91 98450 11223" would otherwise render as #ERROR!.
  sheet.getRange(2, PHONE_COLUMN, dataRows, 1).setNumberFormat("@");

  sheet
    .getRange(2, RECEIVED_AT_COLUMN, dataRows, 1)
    .setNumberFormat(TIMESTAMP_FORMAT);

  sheet.autoResizeColumns(1, HEADERS.length);
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
}

function doPost(e) {
  // Serialise concurrent submissions so two people submitting at the same
  // moment can't collide on the same row.
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json({ status: "error", message: "Empty request body" });
    }

    var data = JSON.parse(e.postData.contents);

    // Honeypot: real users never see this field, bots fill it in.
    if (data.website) {
      return json({ status: "ignored" });
    }

    var sheet = getSheet();

    // Safety net: if the sheet is completely empty, lay down headers first.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    // Format the phone cell as text *before* writing, so the value is stored
    // literally instead of being parsed as a formula.
    var row = sheet.getLastRow() + 1;
    sheet.getRange(row, PHONE_COLUMN).setNumberFormat("@");
    sheet.getRange(row, RECEIVED_AT_COLUMN).setNumberFormat(TIMESTAMP_FORMAT);

    sheet.getRange(row, 1, 1, HEADERS.length).setValues([
      [
        new Date(),
        data.name || "",
        data.email || "",
        data.phone || "",
        data.interest || "",
        data.message || "",
        data.submittedAt || "",
        data.source || "",
      ],
    ]);

    return json({ status: "success" });
  } catch (error) {
    return json({ status: "error", message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
