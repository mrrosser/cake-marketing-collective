# Google Form Confirmation Automation

## Purpose

Keep Google Forms as the intake layer while sending branded confirmation emails and routing leads to the public Google Calendar booking schedule.

## Inputs Required

- Published public Google Form responder URL: `https://docs.google.com/forms/d/e/1FAIpQLSeWYq4nROWTPU8hvwwu8Pvm1-qGNB8DkeIo001dFaPC_HsR7g/viewform?usp=publish-editor`
- Google Form public responder ID: `1FAIpQLSeWYq4nROWTPU8hvwwu8Pvm1-qGNB8DkeIo001dFaPC_HsR7g`
- Google Form file/edit ID: `1hbfukZNrUW2gc0Y60eiNufHDw7kFqnW9f8oQDOTtCbs`
- Google Form question list and field mapping.
- Target sender account for confirmation emails.
- Final confirmation-email copy and internal notification recipients.

## Repo Structure

- `apps-script/google-form-confirmation/Code.gs`
- `apps-script/google-form-confirmation/appsscript.json`
- `apps-script/google-form-confirmation/README.md`

## Deployment Flow

1. Install `clasp` locally and authenticate with the Google account that owns the form.
2. Create a standalone or form-bound Apps Script project.
3. Copy `ScriptProperties` values for `BOOKING_URL`, `FORM_FILE_ID`, `EXPECTED_FORM_ID`, and `INTERNAL_NOTIFY_EMAIL`.
4. Push the script with `clasp push`.
5. Run `configureProject()` or `installFormSubmitTrigger()` once to add the installable `onFormSubmit` trigger.
6. Test with a staging submission before launch.

## Current Field Map

| Google Form question | Script field |
| --- | --- |
| `Name` | `name` |
| `Role` | `role` |
| `Business Name` | `businessName` |
| `Email` | `email` |
| `Phone number` | `phone` |
| `Which services are you interested in?` | `serviceInterest` |
| `What` | `message` |

If the form editor renames any of these questions, update `mapPayload_` in `apps-script/google-form-confirmation/Code.gs` before re-publishing the trigger.

## Idempotency

- Use the Google Form response ID as the primary deduplication key.
- Store sent response IDs in script properties or a linked sheet tab.
- Skip duplicate sends and log the skip with the same correlation ID.

## Logging

Log a structured JSON payload per submission:

```json
{
  "service": "cake-google-form-confirmation",
  "correlationId": "cake-form-response-12345",
  "event": "confirmation_sent",
  "responseId": "12345"
}
```
