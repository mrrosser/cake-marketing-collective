var SCRIPT_NAME = 'cake-google-form-confirmation';
var TEMPLATE_VERSION = 'v1';

function onFormSubmit(e) {
  if (!e || !e.response) {
    throw new Error('Missing FormResponse event payload.');
  }

  validateExpectedForm_(e);
  var payload = mapPayload_(e.response);
  var correlationId = createCorrelationId_(payload.responseId, payload.submittedAt);

  if (isDuplicateResponse_(payload.responseId)) {
    logEvent_('duplicate_skip', payload, correlationId);
    return;
  }

  sendConfirmationEmail_(payload, correlationId);
  sendInternalNotification_(payload, correlationId);
  markResponseSent_(payload.responseId);
  logEvent_('confirmation_sent', payload, correlationId);
}

function setScriptDefaults() {
  PropertiesService.getScriptProperties().setProperties({
    BOOKING_URL: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1b2erysb3xlhK3aszk0xIlfGY3mde5PKtqnX3S2uo90SjdwwYeQDOnKt_dP0d074eiUpowId6t',
    INTERNAL_NOTIFY_EMAIL: 'contact@cakemarketingllc.com',
    EXPECTED_FORM_ID: '1FAIpQLSeWYq4nROWTPU8hvwwu8Pvm1-qGNB8DkeIo001dFaPC_HsR7g',
  });
}

function mapPayload_(response) {
  var itemResponses = response.getItemResponses();
  var data = {};

  for (var index = 0; index < itemResponses.length; index += 1) {
    var item = itemResponses[index];
    data[item.getItem().getTitle()] = String(item.getResponse() || '').trim();
  }

  var serviceInterest = pickValue_(data, [
    'Which services are you interested in?',
    'Service Interest',
    'What support do you need?',
    'Primary Service',
  ]);
  var role = pickValue_(data, ['Role', 'Title']);
  var businessName = pickValue_(data, ['Business Name', 'Company Name', 'Organization']);
  var phone = pickValue_(data, ['Phone number', 'Phone']);
  var payload = {
    responseId: getResponseId_(response),
    submittedAt: response.getTimestamp().toISOString(),
    name: pickValue_(data, ['Name', 'Full Name', 'First and Last Name']) || 'friend',
    email: pickValue_(data, ['Email', 'Email Address']),
    role: role,
    businessName: businessName,
    phone: phone,
    serviceInterest: serviceInterest || 'your project',
    projectType:
      pickValue_(data, ['Project Type', 'What are you building?', 'Event Type']) ||
      businessName ||
      role ||
      'event strategy',
    message: pickValue_(data, ['What', 'Message', 'Tell us more', 'Project Details']) || '',
    bookingUrl: getRequiredProperty_('BOOKING_URL'),
    emailTemplateVersion: TEMPLATE_VERSION,
  };

  if (!payload.email) {
    throw new Error('Unable to determine recipient email from form response.');
  }

  return payload;
}

function pickValue_(data, candidateKeys) {
  for (var index = 0; index < candidateKeys.length; index += 1) {
    if (data[candidateKeys[index]]) {
      return data[candidateKeys[index]];
    }
  }

  return '';
}

function getResponseId_(response) {
  if (typeof response.getId === 'function') {
    return String(response.getId());
  }

  return String(response.getTimestamp().getTime());
}

function getRequiredProperty_(key) {
  var value = PropertiesService.getScriptProperties().getProperty(key);

  if (!value) {
    throw new Error('Missing required script property: ' + key);
  }

  return value;
}

function validateExpectedForm_(e) {
  var expectedFormId = PropertiesService.getScriptProperties().getProperty('EXPECTED_FORM_ID');

  if (!expectedFormId || !e.source || typeof e.source.getId !== 'function') {
    return;
  }

  var actualFormId = String(e.source.getId());

  if (actualFormId !== expectedFormId) {
    throw new Error('Unexpected form source: ' + actualFormId);
  }
}

function isDuplicateResponse_(responseId) {
  return Boolean(PropertiesService.getScriptProperties().getProperty('sent_' + responseId));
}

function markResponseSent_(responseId) {
  PropertiesService.getScriptProperties().setProperty('sent_' + responseId, new Date().toISOString());
}

function sendConfirmationEmail_(payload, correlationId) {
  var htmlBody = renderConfirmationHtml_(payload, correlationId);

  MailApp.sendEmail({
    to: payload.email,
    subject: "You're in, " + payload.name + ' — let\'s build something memorable',
    htmlBody: htmlBody,
    name: 'Cake Marketing Collective',
  });
}

function sendInternalNotification_(payload, correlationId) {
  var internalEmail = getRequiredProperty_('INTERNAL_NOTIFY_EMAIL');
  var body = [
    'New Cake Marketing inquiry received.',
    '',
    'Correlation ID: ' + correlationId,
    'Name: ' + payload.name,
    'Role: ' + payload.role,
    'Business Name: ' + payload.businessName,
    'Email: ' + payload.email,
    'Phone: ' + payload.phone,
    'Service Interest: ' + payload.serviceInterest,
    'Project Type: ' + payload.projectType,
    'Message: ' + payload.message,
    '',
    'Booking URL: ' + payload.bookingUrl,
  ].join('\n');

  MailApp.sendEmail({
    to: internalEmail,
    subject: '[Cake Marketing] New inquiry from ' + payload.name,
    body: body,
    name: 'Cake Marketing Collective',
  });
}

function renderConfirmationHtml_(payload, correlationId) {
  var safeName = escapeHtml_(payload.name);
  var safeServiceInterest = escapeHtml_(payload.serviceInterest);
  var safeProjectType = escapeHtml_(payload.projectType);
  var safeBusinessName = escapeHtml_(payload.businessName || '');
  var contextLine = safeBusinessName
    ? 'We received your note about <strong>' + safeServiceInterest + '</strong> for <strong>' + safeBusinessName + '</strong>.'
    : 'We received your note about <strong>' + safeServiceInterest + '</strong> and logged it under <strong>' + safeProjectType + '</strong>.';

  return [
    '<div style="background:#050505;padding:40px 24px;color:#f7f2f8;font-family:Georgia,serif;">',
    '<div style="max-width:640px;margin:0 auto;border:1px solid rgba(203,108,230,0.25);padding:32px;border-radius:24px;background:linear-gradient(180deg,rgba(149,76,246,0.12),rgba(5,5,5,0.96));">',
    '<p style="letter-spacing:0.18em;text-transform:uppercase;font-size:12px;color:#cb6ce6;margin:0 0 16px;">Cake Marketing Collective</p>',
    '<h1 style="font-size:36px;line-height:1.1;margin:0 0 16px;">Thanks for reaching out, ' + safeName + '.</h1>',
    '<p style="font-size:18px;line-height:1.7;color:#e7dff0;margin:0 0 16px;">' + contextLine + '</p>',
    '<p style="font-size:16px;line-height:1.7;color:#d3c7df;margin:0 0 24px;">Your next step is to lock in the discovery call so the strategy, the room, and the partner story can start taking shape.</p>',
    '<p style="margin:0 0 28px;"><a href="' + payload.bookingUrl + '" style="display:inline-block;padding:14px 24px;background:#954cf6;color:#fff;text-decoration:none;border-radius:999px;font-family:Arial,sans-serif;font-weight:600;">Book your discovery call</a></p>',
    '<p style="font-size:14px;line-height:1.7;color:#b7a9c7;margin:0;">Correlation ID: ' + correlationId + '<br />Template version: ' + payload.emailTemplateVersion + '</p>',
    '</div>',
    '</div>',
  ].join('');
}

function createCorrelationId_(responseId, submittedAt) {
  return 'cake-form-' + responseId + '-' + String(submittedAt).replace(/[^0-9]/g, '').slice(0, 14);
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function logEvent_(eventName, payload, correlationId) {
  console.log(
    JSON.stringify({
      service: SCRIPT_NAME,
      event: eventName,
      correlationId: correlationId,
      responseId: payload.responseId,
      email: payload.email,
      submittedAt: payload.submittedAt,
    }),
  );
}
