// Single source for AUD currency formatting. Was duplicated in 6 places —
// admin pages, referrer dashboard, and both mailers — making it easy to
// drift on locale / fraction digits / currency code.

const AUD_FORMATTER = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

export function formatCurrency(amount) {
  if (amount == null) return null;
  return AUD_FORMATTER.format(amount);
}

// Some call sites prefer "—" placeholder over null; offer both forms.
export function formatCurrencyOrDash(amount) {
  return formatCurrency(amount) ?? "—";
}
