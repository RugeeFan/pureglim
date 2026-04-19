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
  if (!Array.isArray(addOns) || !addOns.length) return null;
  return addOns.map((item) => `${item.label} (+$${item.price})`).join(", ");
}

function buildHtml(request, intro, footer) {
  const ref = buildQuoteRequestReference(request.id);
  const serviceLabel = formatServiceTypeLabel(request.serviceType.toLowerCase());

  const rows = [
    ["Service", serviceLabel],
    ["Reference", ref],
    ["Name", request.customerName],
    request.companyName ? ["Company", request.companyName] : null,
    ["Address", request.address],
    request.bedrooms ? ["Bedrooms", request.bedrooms] : null,
    request.bathrooms ? ["Bathrooms", request.bathrooms] : null,
    request.frequency ? ["Frequency", request.frequency] : null,
    request.siteType ? ["Site type", request.siteType] : null,
    request.siteSchedule ? ["Site schedule", request.siteSchedule] : null,
    request.preferredDate ? ["Preferred date", request.preferredDate] : null,
    request.preferredTime ? ["Preferred time", request.preferredTime] : null,
    request.estimatedPrice ? ["Estimated price", `$${request.estimatedPrice}`] : null,
    request.originalAmount != null ? ["Original amount", `$${request.originalAmount}`] : null,
    request.discountAmount ? ["Discount amount", `-$${request.discountAmount}`] : null,
    request.finalAmount != null ? ["Final amount", `$${request.finalAmount}`] : null,
    request.referralCode ? ["Referral code", request.referralCode] : null,
    request.notes ? ["Notes", request.notes] : null,
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
          <h1 style="margin:0;font-size:28px;line-height:1.05;">We&apos;ve received your request</h1>
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

function buildText(request, intro, footer) {
  const ref = buildQuoteRequestReference(request.id);
  const serviceLabel = formatServiceTypeLabel(request.serviceType.toLowerCase());

  return [
    intro || null,
    `Service: ${serviceLabel}`,
    `Reference: ${ref}`,
    `Name: ${request.customerName}`,
    request.companyName ? `Company: ${request.companyName}` : null,
    `Address: ${request.address}`,
    request.bedrooms ? `Bedrooms: ${request.bedrooms}` : null,
    request.bathrooms ? `Bathrooms: ${request.bathrooms}` : null,
    request.frequency ? `Frequency: ${request.frequency}` : null,
    request.siteType ? `Site type: ${request.siteType}` : null,
    request.siteSchedule ? `Site schedule: ${request.siteSchedule}` : null,
    request.preferredDate ? `Preferred date: ${request.preferredDate}` : null,
    request.preferredTime ? `Preferred time: ${request.preferredTime}` : null,
    request.estimatedPrice ? `Estimated price: $${request.estimatedPrice}` : null,
    request.originalAmount != null ? `Original amount: $${request.originalAmount}` : null,
    request.discountAmount ? `Discount amount: -$${request.discountAmount}` : null,
    request.finalAmount != null ? `Final amount: $${request.finalAmount}` : null,
    request.referralCode ? `Referral code: ${request.referralCode}` : null,
    request.notes ? `Notes: ${request.notes}` : null,
    footer || null,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendCustomerConfirmation(request) {
  const ref = buildQuoteRequestReference(request.id);

  if (process.env.EMAIL_DISABLED === "true") {
    console.log("[email] EMAIL_DISABLED — would send customer confirmation to:", request.email, "| subject:", `Your PureGlim request has been received — ${ref}`);
    return;
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT) {
    throw new Error("SMTP configuration is incomplete.");
  }

  const intro = await getSetting(
    SETTING_KEYS.CUSTOMER_EMAIL_INTRO,
    "Thanks for reaching out! Here's a summary of what we've received.",
  );
  const footer = await getSetting(
    SETTING_KEYS.CUSTOMER_EMAIL_FOOTER,
    "We'll be in touch within 24 hours to confirm your booking.",
  );

  const transporter = getTransporter();

  await transporter.sendMail({
    from: process.env.MAIL_FROM || "PureGlim <noreply@pureglim.local>",
    to: request.email,
    subject: `Your PureGlim request has been received — ${ref}`,
    text: buildText(request, intro, footer),
    html: buildHtml(request, intro, footer),
  });
}
