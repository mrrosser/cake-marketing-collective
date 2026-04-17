# Google Form Confirmation Automation

## Purpose

Document the legacy Google Form + Apps Script workflow that now serves as a fallback/reference intake path. The primary live intake runtime should be the native on-site multi-step form and routing flow.

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

## Current Status

- Script project URL: `https://script.google.com/d/13vhn866lXL7978QUe61xxocPdpbzh7FinqhtRyP7HenmFu62s0bYGeOF/edit`
- Real intake form file/edit ID: `1hbfukZNrUW2gc0Y60eiNufHDw7kFqnW9f8oQDOTtCbs`
- Public responder URL is live.
- `configureProject()` has been run from the Apps Script editor.
- An installable trigger is present for `onFormSubmit`.
- The workflow should be treated as backup-only after native intake deployment.

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
