# Google Form Confirmation Script

This folder contains the Apps Script scaffold for branded confirmation emails and internal notifications when the Cake Marketing Collective intake form receives a submission.

## Required Script Properties

- `BOOKING_URL`
- `INTERNAL_NOTIFY_EMAIL`
- `EXPECTED_FORM_ID` optional if you want to validate the bound form

## Deployment

1. Install `clasp`.
2. Create or link the Apps Script project.
3. Push the files in this folder.
4. Run `setScriptDefaults()` once, then overwrite the placeholder values in Script Properties.
5. Add an installable `onFormSubmit` trigger.

## Behavior

- Uses the response ID as the idempotency key.
- Sends a branded HTML confirmation email to the respondent.
- Sends an internal plain-text notification.
- Logs structured JSON with a correlation ID for every processed submission.
