# Google Apps Script Form Integration

This document explains how the form in the application integrates with Google Sheets using Google Apps Script.

## Overview

The subscription form in the application (`/src/app/subscribe/page.tsx`) submits data to a Google Apps Script Web App, which then:

1. Stores the data in a Google Sheet
2. Sends an email notification when new submissions arrive

## How It Works

### Client-Side (Next.js)

The form implementation in `/src/app/subscribe/page.tsx`:

1. Collects user information (name, email, plan selection)
2. Uses utility functions from `/src/lib/google-script.ts` to submit data to the Google Apps Script Web App
3. Uses multiple fallback mechanisms to ensure data is submitted successfully:
   - Primary: Direct fetch to Google Apps Script
   - Secondary: Iframe-based submission (better compatibility with some browsers)
   - Tertiary: Netlify form as ultimate fallback

### Server-Side (Google Apps Script)

The Google Apps Script Web App (deployed at the URL configured in the application) handles:

1. Receiving form data via HTTP POST
2. Validating the data
3. Appending it to a Google Sheet
4. Sending an email notification to the site administrator

## Configuration

### Web App URL

The Google Apps Script Web App URL is configured in `handleSubmit()` function:

```typescript
const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbz_t77GINGIcOOBo0UnJYxv3E_VKQZd6hq85fpnFazUqVxjFqtlmZ0qmdbKEk2KqctW6g/exec';
```

### Data Fields

The following data is sent to the Google Sheet:

- **name**: The subscriber's name
- **email**: The subscriber's email address
- **plan**: The selected subscription plan
- **timestamp**: When the form was submitted

## Troubleshooting

If form submissions are not appearing in the Google Sheet:

1. Check browser console for errors
2. Verify the Google Apps Script Web App URL is correct
3. Ensure the Google Apps Script is deployed with access set to "Anyone, even anonymous"
4. Check if the Google Sheet referenced in the script exists and has the correct structure

## Sample Google Apps Script Code

```javascript
// This would be in your Google Apps Script project
function doPost(e) {
  try {
    // Get the form data
    const data = e.parameter || JSON.parse(e.postData.contents);
    
    // Open the Google Sheet
    const ss = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID');
    const sheet = ss.getSheetByName('Subscriptions');
    
    // Append row to spreadsheet
    sheet.appendRow([
      new Date(), // Timestamp
      data.name,
      data.email,
      data.plan
    ]);
    
    // Send email notification
    MailApp.sendEmail({
      to: "your-email@example.com",
      subject: "New IPTV Subscription: " + data.plan,
      body: `New subscription received:
      
Name: ${data.name}
Email: ${data.email}
Plan: ${data.plan}
Time: ${new Date().toString()}
      
Check the spreadsheet for full details.`
    });
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log error and return failure response
    console.error(error);
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Deployment Steps

1. Create a new Google Sheet to store form submissions
2. Create a new Google Apps Script project
3. Add code similar to the sample above
4. Deploy as a web app with permissions set to "Anyone, even anonymous"
5. Copy the web app URL into the React application
