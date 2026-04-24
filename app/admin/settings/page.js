import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "../../../lib/auth/session";
import { getSettings, updateSettings, SETTING_KEYS } from "../../../lib/services/settings";
import { sendTestEmail } from "../../../lib/mail/sendQuoteRequestNotification";
import ChangePasswordForm from "./ChangePasswordForm";

export const metadata = { title: "Settings — PureGlim Admin" };

async function saveSettings(formData) {
  "use server";
  const cookieStore = await cookies();
  const session = await getSession(cookieStore);
  if (!session.valid) redirect("/admin/login");

  await updateSettings([
    { key: SETTING_KEYS.NOTIFICATION_EMAIL, value: formData.get("notification_email")?.trim() ?? "" },
    { key: SETTING_KEYS.EMAIL_INTRO, value: formData.get("email_intro")?.trim() ?? "" },
    { key: SETTING_KEYS.EMAIL_FOOTER, value: formData.get("email_footer")?.trim() ?? "" },
    { key: SETTING_KEYS.CUSTOMER_EMAIL_INTRO, value: formData.get("customer_email_intro")?.trim() ?? "" },
    { key: SETTING_KEYS.CUSTOMER_EMAIL_FOOTER, value: formData.get("customer_email_footer")?.trim() ?? "" },
  ]);

  redirect("/admin/settings?saved=1");
}

async function testEmail() {
  "use server";
  const cookieStore = await cookies();
  const session = await getSession(cookieStore);
  if (!session.valid) redirect("/admin/login");

  let sentTo;
  try {
    sentTo = await sendTestEmail();
  } catch (err) {
    redirect(`/admin/settings?test_error=${encodeURIComponent(err.message)}`);
  }
  redirect(`/admin/settings?tested=${encodeURIComponent(sentTo)}`);
}

export default async function SettingsPage({ searchParams }) {
  const cookieStore = await cookies();
  const session = await getSession(cookieStore);
  if (!session.valid) redirect("/admin/login");

  const settings = await getSettings([
    SETTING_KEYS.NOTIFICATION_EMAIL,
    SETTING_KEYS.EMAIL_INTRO,
    SETTING_KEYS.EMAIL_FOOTER,
    SETTING_KEYS.CUSTOMER_EMAIL_INTRO,
    SETTING_KEYS.CUSTOMER_EMAIL_FOOTER,
  ]);

  const { saved, tested, test_error } = await searchParams;

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Settings</h1>
      </div>

      {saved && (
        <div className="admin-settings-banner admin-settings-banner--success" role="status">
          Settings saved.
        </div>
      )}
      {tested && (
        <div className="admin-settings-banner admin-settings-banner--success" role="status">
          Test email sent to <strong>{decodeURIComponent(tested)}</strong>. Check your inbox.
        </div>
      )}
      {test_error && (
        <div className="admin-settings-banner admin-settings-banner--error" role="alert">
          Failed to send test email: {decodeURIComponent(test_error)}
        </div>
      )}

      <form action={saveSettings} className="admin-settings-form">
        <section className="admin-detail-section">
          <h2 className="admin-detail-section-title">Email Notifications</h2>

          <div className="admin-form-group">
            <label htmlFor="notification_email" className="admin-form-label">
              Recipient Email
            </label>
            <p className="admin-form-hint">
              Where new enquiry notifications are sent. Overrides the{" "}
              <code>NOTIFICATION_EMAIL</code> environment variable when set.
            </p>
            <input
              id="notification_email"
              name="notification_email"
              type="email"
              defaultValue={settings[SETTING_KEYS.NOTIFICATION_EMAIL]}
              placeholder={process.env.NOTIFICATION_EMAIL || "e.g. hello@example.com"}
              className="admin-form-input admin-form-input--wide"
            />
          </div>
        </section>

        <section className="admin-detail-section">
          <h2 className="admin-detail-section-title">Email Template</h2>

          <div className="admin-form-group">
            <label htmlFor="email_intro" className="admin-form-label">
              Intro / Opening Message
            </label>
            <p className="admin-form-hint">
              Appears at the top of the email, above the enquiry details. Leave blank to omit.
            </p>
            <textarea
              id="email_intro"
              name="email_intro"
              rows={4}
              defaultValue={settings[SETTING_KEYS.EMAIL_INTRO]}
              placeholder="e.g. A new enquiry has been submitted via the website. Please follow up within 24 hours."
              className="admin-form-textarea"
            />
          </div>

          <div className="admin-form-group" style={{ marginTop: "20px" }}>
            <label htmlFor="email_footer" className="admin-form-label">
              Footer / Signature
            </label>
            <p className="admin-form-hint">
              Appears at the bottom of the email, below the enquiry details. Leave blank to omit.
            </p>
            <textarea
              id="email_footer"
              name="email_footer"
              rows={4}
              defaultValue={settings[SETTING_KEYS.EMAIL_FOOTER]}
              placeholder="e.g. PureGlim Cleaning Services&#10;Phone: 04xx xxx xxx&#10;pureglim.com.au"
              className="admin-form-textarea"
            />
          </div>
        </section>

        <section className="admin-detail-section">
          <h2 className="admin-detail-section-title">Customer Confirmation Email</h2>
          <p className="admin-form-hint" style={{ marginBottom: "16px" }}>
            Sent to the customer&apos;s email address when their request is received.
          </p>

          <div className="admin-form-group">
            <label htmlFor="customer_email_intro" className="admin-form-label">
              Intro / Opening Message
            </label>
            <p className="admin-form-hint">
              Appears at the top of the confirmation email. Leave blank to use the default.
            </p>
            <textarea
              id="customer_email_intro"
              name="customer_email_intro"
              rows={4}
              defaultValue={settings[SETTING_KEYS.CUSTOMER_EMAIL_INTRO]}
              placeholder="e.g. Thanks for reaching out! Here's a summary of what we've received."
              className="admin-form-textarea"
            />
          </div>

          <div className="admin-form-group" style={{ marginTop: "20px" }}>
            <label htmlFor="customer_email_footer" className="admin-form-label">
              Footer / Signature
            </label>
            <p className="admin-form-hint">
              Appears at the bottom of the confirmation email. Leave blank to use the default.
            </p>
            <textarea
              id="customer_email_footer"
              name="customer_email_footer"
              rows={4}
              defaultValue={settings[SETTING_KEYS.CUSTOMER_EMAIL_FOOTER]}
              placeholder="e.g. We'll be in touch within 24 hours to confirm your booking."
              className="admin-form-textarea"
            />
          </div>
        </section>

        <div className="admin-settings-actions">
          <button type="submit" className="admin-submit-btn">
            Save Settings
          </button>
        </div>
      </form>

      <ChangePasswordForm />

      <section className="admin-detail-section admin-settings-test-section">
        <h2 className="admin-detail-section-title">Test Email</h2>
        <p className="admin-form-hint" style={{ marginBottom: "14px" }}>
          Sends a test email to the configured recipient address using the current template settings.
          Make sure you save your settings first before testing.
        </p>
        <form action={testEmail}>
          <button type="submit" className="admin-submit-btn admin-submit-btn--outline">
            Send test email
          </button>
        </form>
      </section>
    </div>
  );
}
