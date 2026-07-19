/**
 * HASARA & SHEHARA — RSVP Collector (Google Apps Script)
 *
 * WHAT THIS DOES
 * Receives RSVP submissions from the invitation website and writes each
 * one as a new row in this spreadsheet. No database, no server, no cost.
 *
 * HOW TO USE THIS FILE — see the full step-by-step guide, but in short:
 *   1. Open the Google Sheet you want RSVPs to land in (or create a new one).
 *   2. Extensions → Apps Script.
 *   3. Delete anything in the editor, paste this entire file in its place.
 *   4. Click Deploy → New deployment → type: Web app.
 *        Execute as: Me
 *        Who has access: Anyone
 *   5. Click Deploy, authorize when asked, then copy the "Web app URL".
 *   6. Paste that URL into APPS_SCRIPT_URL in app.js on your website.
 */

const SHEET_NAME = "RSVPs";

// Runs once automatically the first time a submission comes in, or you
// can run it manually from the Apps Script editor (select this function
// in the toolbar dropdown, click ▶ Run) to set up the header row early.
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Submitted At",
      "Name",
      "Attending",
      "Guests",
      "Phone",
      "Message",
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 6).setFontWeight("bold");
  }
  return sheet;
}

// Handles every RSVP submission from the website.
function doPost(e) {
  try {
    const sheet = setupSheet();

    const params = e.parameter || {};
    const name = params.name || "";
    const attending = params.attending || "";
    const guests = params.guests || "0";
    const phone = params.phone || "";
    const message = params.message || "";
    const submittedAt = params.submittedAt || new Date().toISOString();

    sheet.appendRow([submittedAt, name, attending, guests, phone, message]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Lets you open the Web App URL directly in a browser tab to sanity-check
// it's deployed and running, without needing to submit a real RSVP first.
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "RSVP collector is running." }))
    .setMimeType(ContentService.MimeType.JSON);
}
