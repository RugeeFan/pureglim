import nodemailer from "nodemailer";
import { buildQuoteRequestReference, formatServiceTypeLabel } from "../services/quoteRequests";
import { getSetting, SETTING_KEYS } from "../services/settings";
import { escapeHtml } from "./escapeHtml";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
  });
}

function formatAddOns(addOns) {
  if (!Array.isArray(addOns) || !addOns.length) {
    return "None";
  }
  return addOns.map((item) => `${item.label} (+$${item.price})`).join(", ");
}

function formatSubmittedAt(date) {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function buildSubject(request) {
  const serviceLabel = formatServiceTypeLabel(request.serviceType.toLowerCase());
  const nameLabel = request.companyName || request.customerName;
  return `New ${serviceLabel} Enquiry - ${nameLabel}`;
}

function buildText(request, intro, footer) {
  return [
    intro || null,
    `Service: ${formatServiceTypeLabel(request.serviceType.toLowerCase())}`,
    `Reference: ${buildQuoteRequestReference(request.id)}`,
    `Status: ${request.status}`,
    `Name: ${request.customerName}`,
    request.companyName ? `Company: ${request.companyName}` : null,
    `Phone: ${request.phone}`,
    `Email: ${request.email}`,
    `Address: ${request.address}`,
    request.bedrooms ? `Bedrooms: ${request.bedrooms}` : null,
    request.bathrooms ? `Bathrooms: ${request.bathrooms}` : null,
    request.frequency ? `Frequency: ${request.frequency}` : null,
    request.siteType ? `Site type: ${request.siteType}` : null,
    request.siteSchedule ? `Preferred schedule: ${request.siteSchedule}` : null,
    request.preferredDate ? `Preferred date: ${request.preferredDate}` : null,
    request.preferredTime ? `Preferred time: ${request.preferredTime}` : null,
    request.estimatedPrice ? `Estimated price: $${request.estimatedPrice}` : null,
    `Add-ons: ${formatAddOns(request.addOns)}`,
    `Notes / Special Requirements: ${request.notes || "None"}`,
    `Submitted: ${formatSubmittedAt(request.createdAt)}`,
    footer || null,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildHtml(request, intro, footer) {
  const rows = [
    ["Service", formatServiceTypeLabel(request.serviceType.toLowerCase())],
    ["Reference", buildQuoteRequestReference(request.id)],
    ["Status", request.status],
    ["Name", request.customerName],
    request.companyName ? ["Company", request.companyName] : null,
    ["Phone", request.phone],
    ["Email", request.email],
    ["Address", request.address],
    request.bedrooms ? ["Bedrooms", request.bedrooms] : null,
    request.bathrooms ? ["Bathrooms", request.bathrooms] : null,
    request.frequency ? ["Frequency", request.frequency] : null,
    request.siteType ? ["Site type", request.siteType] : null,
    request.siteSchedule ? ["Preferred schedule", request.siteSchedule] : null,
    request.preferredDate ? ["Preferred date", request.preferredDate] : null,
    request.preferredTime ? ["Preferred time", request.preferredTime] : null,
    request.estimatedPrice ? ["Estimated price", `$${request.estimatedPrice}`] : null,
    ["Add-ons", formatAddOns(request.addOns)],
    ["Notes / Special Requirements", request.notes || "None"],
    ["Submitted", formatSubmittedAt(request.createdAt)],
  ].filter(Boolean);

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;">${escapeHtml(label)}</td><td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;color:#111827;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  const introHtml = intro
    ? `<p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.6;">${escapeHtml(intro).replace(/\n/g, "<br>")}</p>`
    : "";

  const footerHtml = footer
    ? `<p style="margin:16px 0 0;font-size:13px;color:#6b7280;line-height:1.6;border-top:1px solid #e5e7eb;padding-top:14px;">${escapeHtml(footer).replace(/\n/g, "<br>")}</p>`
    : "";

  return `
    <div style="font-family:Arial,sans-serif;background:#f5f7f6;padding:24px;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="padding:24px 24px 18px;background:#0f1f1c;color:#f8fbfa;">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.75;">PureGlim</p>
          <h1 style="margin:0;font-size:28px;line-height:1.05;">New enquiry received</h1>
        </div>
        <div style="padding:18px 24px 24px;">
          ${introHtml}
          <table style="width:100%;border-collapse:collapse;">${tableRows}</table>
          ${footerHtml}
        </div>
      </div>
    </div>
  `;
}

export async function sendTestEmail() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT) {
    throw new Error("SMTP configuration is incomplete (SMTP_HOST / SMTP_PORT missing).");
  }

  const notificationEmail = await getSetting(
    SETTING_KEYS.NOTIFICATION_EMAIL,
    process.env.NOTIFICATION_EMAIL,
  );

  if (!notificationEmail) {
    throw new Error("Notification email is not configured.");
  }

  const intro = await getSetting(SETTING_KEYS.EMAIL_INTRO);
  const footer = await getSetting(SETTING_KEYS.EMAIL_FOOTER);

  const transporter = getTransporter();

  const introHtml = intro
    ? `<p style="margin:0 0 16px;font-size:14px;color:#374151;line-height:1.6;">${escapeHtml(intro).replace(/\n/g, "<br>")}</p>`
    : "";
  const footerHtml = footer
    ? `<p style="margin:16px 0 0;font-size:13px;color:#6b7280;line-height:1.6;border-top:1px solid #e5e7eb;padding-top:14px;">${escapeHtml(footer).replace(/\n/g, "<br>")}</p>`
    : "";

  const html = `
    <div style="font-family:Arial,sans-serif;background:#f5f7f6;padding:24px;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="padding:24px 24px 18px;background:#0f1f1c;color:#f8fbfa;">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.75;">PureGlim</p>
          <h1 style="margin:0;font-size:28px;line-height:1.05;">Test email</h1>
        </div>
        <div style="padding:18px 24px 24px;">
          ${introHtml}
          <p style="margin:0;font-size:14px;color:#374151;">This is a test email sent from your PureGlim admin settings. If you received this, your email configuration is working correctly.</p>
          ${footerHtml}
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.MAIL_FROM || "PureGlim <noreply@pureglim.local>",
    to: notificationEmail,
    subject: "PureGlim — Test Email",
    text: `This is a test email sent from your PureGlim admin settings.\n\nIf you received this, your email configuration is working correctly.\n\n${footer || ""}`.trim(),
    html,
  });

  return notificationEmail;
}

export async function sendQuoteRequestNotification(request) {
  if (process.env.EMAIL_DISABLED === "true") {
    console.log("[email] EMAIL_DISABLED — would send notification to:", process.env.NOTIFICATION_EMAIL, "| subject:", buildSubject(request));
    return;
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT) {
    throw new Error("SMTP configuration is incomplete.");
  }

  // Recipient: DB setting takes precedence over env var
  const notificationEmail = await getSetting(
    SETTING_KEYS.NOTIFICATION_EMAIL,
    process.env.NOTIFICATION_EMAIL,
  );

  if (!notificationEmail) {
    throw new Error("Notification email is not configured.");
  }

  const intro = await getSetting(SETTING_KEYS.EMAIL_INTRO);
  const footer = await getSetting(SETTING_KEYS.EMAIL_FOOTER);

  const transporter = getTransporter();

  await transporter.sendMail({
    from: process.env.MAIL_FROM || "PureGlim <noreply@pureglim.local>",
    to: notificationEmail,
    subject: buildSubject(request),
    text: buildText(request, intro, footer),
    html: buildHtml(request, intro, footer),
  });
}
