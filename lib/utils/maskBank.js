// Mask bank account fields for display in admin contexts.
// Default behaviour shows only the last 3 digits — enough for the admin to
// confirm "the right account" while screen-sharing without exposing the full
// number. Pair with an explicit reveal action for the rare cases where the
// full number is needed (audit, payment processing, dispute), and write to
// an audit log when revealed.

export function maskAccountNumber(input) {
  if (!input) return "";
  const digits = String(input).replace(/\D/g, "");
  if (digits.length <= 3) {
    return "•".repeat(Math.max(digits.length, 1));
  }
  const tail = digits.slice(-3);
  return `${"•".repeat(digits.length - 3)}${tail}`;
}

export function maskBsb(input) {
  if (!input) return "";
  const digits = String(input).replace(/\D/g, "");
  if (digits.length !== 6) {
    // Unexpected shape — mask everything to be safe
    return "•".repeat(Math.max(digits.length, 1));
  }
  // BSB is "XXX-XXX". Reveal only the last 2 of the second triplet.
  return `•••-•${digits.slice(4)}`;
}
