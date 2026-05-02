// Next.js calls register() once at server startup (Node runtime).
// Fail fast if any required secret is missing — better to crash on boot
// than to mint unauthenticated cookies or hit a redirect loop on every
// request (the proxy.js middleware calls into both sessions on every hit).

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const required = [
    ["ADMIN_JWT_SECRET", "admin session signing"],
    ["PARTNER_JWT_SECRET", "referrer session signing"],
    ["ADMIN_USERNAME", "admin login identity"],
  ];

  const missing = required.filter(([k]) => !process.env[k]);
  if (missing.length > 0) {
    const lines = missing.map(([k, why]) => `  - ${k} (used for ${why})`).join("\n");
    const message = `Required environment variables missing:\n${lines}\n\nRefusing to start. Set them in /opt/pureglim/shared/.env (or .env.local for dev) and retry.`;

    if (process.env.NODE_ENV === "production") {
      console.error(`[instrumentation] ${message}`);
      throw new Error(message);
    } else {
      console.warn(`[instrumentation] ${message}`);
    }
  }

  const secretsTooShort = ["ADMIN_JWT_SECRET", "PARTNER_JWT_SECRET"]
    .filter((k) => process.env[k] && process.env[k].length < 32);
  if (secretsTooShort.length > 0) {
    const message = `JWT secrets too short (<32 chars): ${secretsTooShort.join(", ")}. Generate with: openssl rand -base64 32`;
    if (process.env.NODE_ENV === "production") {
      console.error(`[instrumentation] ${message}`);
      throw new Error(message);
    } else {
      console.warn(`[instrumentation] ${message}`);
    }
  }
}
