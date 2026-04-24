import twilio from "twilio";

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials are not configured.");
  }

  return twilio(accountSid, authToken);
}

export function isTwilioMockMode() {
  return process.env.TWILIO_MOCK_OTP_CODE?.trim().length > 0;
}

export async function startPhoneVerification(phone) {
  if (isTwilioMockMode()) {
    return {
      sid: "mock-verification",
      channel: "sms",
      mock: true,
      devCode: process.env.TWILIO_MOCK_OTP_CODE,
    };
  }

  const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (!verifySid) {
    throw new Error("TWILIO_VERIFY_SERVICE_SID is not configured.");
  }

  const client = getTwilioClient();
  return client.verify.v2
    .services(verifySid)
    .verifications.create({ to: phone, channel: "sms" });
}

export async function verifyPhoneCode(phone, code) {
  if (isTwilioMockMode()) {
    return {
      approved: code === process.env.TWILIO_MOCK_OTP_CODE,
      status:
        code === process.env.TWILIO_MOCK_OTP_CODE ? "approved" : "pending",
      mock: true,
    };
  }

  const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (!verifySid) {
    throw new Error("TWILIO_VERIFY_SERVICE_SID is not configured.");
  }

  const client = getTwilioClient();
  const result = await client.verify.v2
    .services(verifySid)
    .verificationChecks.create({ to: phone, code });

  return {
    approved: result.status === "approved",
    status: result.status,
    mock: false,
  };
}
