// Google Apps Script to receive form submissions and store in Google Sheets
// 
// SETUP INSTRUCTIONS:
// 1. Create a new Google Sheet
// 2. Go to Extensions > Apps Script
// 3. Delete any code there and paste this entire file
// 4. Click Deploy > New deployment
// 5. Select "Web app" as type
// 6. Execute as: "Me"
// 7. Who has access: "Anyone"
// 8. Click Deploy, authorize, and copy the URL
// 9. Paste the URL in script.js

function doPost(e) {
    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

        // Handle both JSON and form data
        var email, timestamp;

        if (e.postData && e.postData.type === 'application/json') {
            var data = JSON.parse(e.postData.contents);
            email = data.email;
            timestamp = data.timestamp;
        } else {
            // Form data
            email = e.parameter.email;
            timestamp = e.parameter.timestamp;
        }

        // Append row
        sheet.appendRow([email, timestamp, new Date()]);

        return ContentService
            .createTextOutput(JSON.stringify({ status: 'success' }))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        return ContentService
            .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function doGet(e) {
    return ContentService.createTextOutput('SynthetixData Email Capture API - Working!');
}
