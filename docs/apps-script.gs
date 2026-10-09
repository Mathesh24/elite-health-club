/**
 * Google Apps Script backing the Elite Health Club booking form.
 *
 * SETUP
 *   1. Sheet > Extensions > Apps Script, replace all code with this file, Save.
 *   2. Run setupSheet() once from the editor (adds the header row).
 *   3. Deploy > Manage deployments > edit the EXISTING deployment >
 *      Version: "New version" > Deploy.  This keeps the same /exec URL.
 *
 *   4. For membership payments, also set the Script Properties described in
 *      the "Membership payments" section below, then authorise MailApp by
 *      running sendTestEmail() once from the editor.
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

    // Payment events come from the Netlify payment functions, not the browser.
    if (typeof data.action === "string" && data.action.indexOf("payment_") === 0) {
      return json(handlePaymentEvent(data));
    }

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

/* ------------------------------------------------------------------------- *
 * Membership payments
 *
 * Called only by the Netlify payment functions (netlify/lib/sheet.ts), which
 * have already verified the payment with Zoho. Requests must carry the shared
 * secret stored in Script Properties:
 *   Project Settings > Script Properties
 *     PAYMENTS_SECRET      long random string, same as Netlify's
 *                          PAYMENTS_SHEET_SECRET
 *     CLUB_NOTIFY_EMAIL    where new-membership alerts go (comma-separated ok)
 * ------------------------------------------------------------------------- */

var PAYMENTS_SHEET_NAME = "Payments";

var PAYMENT_HEADERS = [
  "Created At",
  "Status",
  "Plan",
  "Amount (INR)",
  "Name",
  "Email",
  "Phone",
  "Reference",
  "Session ID",
  "Payment ID",
  "Payment Method",
  "Confirmed At",
  "Confirmed Via",
  "Environment",
];

// 1-based column indexes into PAYMENT_HEADERS.
var PAY_COL = {
  status: 2,
  phone: 7,
  sessionId: 9,
  paymentId: 10,
  method: 11,
  confirmedAt: 12,
  confirmedVia: 13,
};

function handlePaymentEvent(data) {
  var expected = PropertiesService.getScriptProperties().getProperty(
    "PAYMENTS_SECRET"
  );
  if (!expected || data.secret !== expected) {
    return { status: "error", message: "Unauthorized" };
  }

  var sheet = getPaymentsSheet();
  var sessionId = String(data.sessionId || "");
  if (!sessionId) {
    return { status: "error", message: "Missing sessionId" };
  }
  var row = findRowBySessionId(sheet, sessionId);

  if (data.action === "payment_created") {
    if (row) return { status: "duplicate" };
    appendPaymentRow(sheet, data, "created");
    return { status: "success" };
  }

  if (data.action === "payment_update") {
    if (!row) row = appendPaymentRow(sheet, data, "created");

    var current = sheet.getRange(row, PAY_COL.status).getValue();
    // Browser verification and the webhook both report the same payment;
    // only the first confirmation writes and sends emails.
    if (current === "succeeded") return { status: "duplicate" };

    sheet.getRange(row, PAY_COL.status).setValue(data.status || "");
    sheet.getRange(row, PAY_COL.paymentId).setValue(String(data.paymentId || ""));
    sheet.getRange(row, PAY_COL.method).setValue(data.method || "");
    sheet
      .getRange(row, PAY_COL.confirmedAt)
      .setNumberFormat(TIMESTAMP_FORMAT)
      .setValue(new Date());
    sheet.getRange(row, PAY_COL.confirmedVia).setValue(data.source || "");

    if (data.status === "succeeded") {
      sendPaymentEmails(data);
    }
    return { status: "success" };
  }

  return { status: "error", message: "Unknown action" };
}

function getPaymentsSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(PAYMENTS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(PAYMENTS_SHEET_NAME);
    sheet.appendRow(PAYMENT_HEADERS);
    sheet.getRange(1, 1, 1, PAYMENT_HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function findRowBySessionId(sheet, sessionId) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;
  var match = sheet
    .getRange(2, PAY_COL.sessionId, lastRow - 1, 1)
    .createTextFinder(sessionId)
    .matchEntireCell(true)
    .findNext();
  return match ? match.getRow() : 0;
}

function appendPaymentRow(sheet, data, status) {
  var row = sheet.getLastRow() + 1;
  // Keep IDs and phone numbers as text so Sheets doesn't mangle them.
  sheet.getRange(row, 1, 1, PAYMENT_HEADERS.length).setNumberFormat("@");
  sheet.getRange(row, 1).setNumberFormat(TIMESTAMP_FORMAT);
  sheet.getRange(row, 4).setNumberFormat("#,##0");
  sheet.getRange(row, 1, 1, PAYMENT_HEADERS.length).setValues([
    [
      new Date(),
      status,
      data.plan || "",
      Number(data.amount) || "",
      data.name || "",
      data.email || "",
      data.phone || "",
      data.reference || "",
      String(data.sessionId || ""),
      "",
      "",
      "",
      "",
      data.environment || "",
    ],
  ]);
  return row;
}

// Customer replies go to the club inbox, whichever Google account owns this
// script and therefore sends the email.
var SENDER_NAME = "Elite Health Club";
var CLUB_REPLY_TO = "Elitehealthclubkdkr@gmail.com";

var PLAN_NAMES = {
  early_bird: "Early Bird Access (one person)",
  individual: "Individual Membership (5 years)",
  family: "Executive Family Membership (5 years)",
};

function sendPaymentEmails(data) {
  var planName = PLAN_NAMES[data.plan] || data.plan;
  var isEarlyBird = data.plan === "early_bird";
  var amount = "Rs. " + Number(data.amount).toLocaleString("en-IN");
  var isTest = data.environment !== "live";
  var subjectPrefix = isTest ? "[TEST] " : "";

  var details =
    "Plan: " + planName + "\n" +
    "Amount paid: " + amount + " (incl. 18% GST)\n" +
    "Reference: " + data.reference + "\n" +
    "Payment ID: " + data.paymentId + "\n";

  if (data.email) {
    try {
      MailApp.sendEmail({
        to: data.email,
        name: SENDER_NAME,
        replyTo: CLUB_REPLY_TO,
        subject: subjectPrefix + "Welcome to Elite Health Club - payment received",
        body:
          "Dear " + (data.name || "Member") + ",\n\n" +
          "Thank you for joining Elite Health Club. We have received your payment.\n\n" +
          details + "\n" +
          (isEarlyBird
            ? "Our team will contact you to coordinate your Early Bird Access to all club facilities before you choose an individual or family membership. "
            : "Our team will contact you shortly to complete your membership onboarding. ") +
          "Your GST invoice will be shared separately.\n\n" +
          "For any questions, reply to this email or call +91 81878 61777.\n\n" +
          "Warm regards,\nElite Health Club",
      });
    } catch (error) {
      console.error("Member email failed: " + error);
    }
  }

  var notify = PropertiesService.getScriptProperties().getProperty(
    "CLUB_NOTIFY_EMAIL"
  );
  if (notify) {
    try {
      MailApp.sendEmail({
        to: notify,
        name: SENDER_NAME,
        replyTo: data.email || CLUB_REPLY_TO,
        subject: subjectPrefix + "New club payment: " + planName,
        body:
          "A new club payment has been confirmed.\n\n" +
          "Name: " + data.name + "\n" +
          "Email: " + data.email + "\n" +
          "Phone: " + data.phone + "\n" +
          details +
          "Confirmed via: " + data.source + "\n\n" +
          (isEarlyBird ? "Next: issue the GST invoice and coordinate Early Bird Access." : "Next: issue the GST invoice and contact the member for onboarding."),
      });
    } catch (error) {
      console.error("Club email failed: " + error);
    }
  }
}

/** Run once from the editor to grant email permission and check delivery. */
function sendTestEmail() {
  var to = PropertiesService.getScriptProperties().getProperty("CLUB_NOTIFY_EMAIL");
  MailApp.sendEmail({
    to: to,
    name: SENDER_NAME,
    replyTo: CLUB_REPLY_TO,
    subject: "[TEST] Elite Health Club payments email check",
    body: "It works. Membership payment emails will be sent from this account.",
  });
}
