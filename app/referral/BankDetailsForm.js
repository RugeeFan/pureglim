"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BankDetailsForm({ current }) {
  const router = useRouter();
  const hasDetails = Boolean(current?.bsb || current?.payId);
  const [editing, setEditing] = useState(!hasDetails);
  const [paymentMethod, setPaymentMethod] = useState(current?.payId ? "payid" : "bsb");
  const [bankAccountName, setBankAccountName] = useState(current?.bankAccountName ?? "");
  const [bsb, setBsb] = useState(current?.bsb ?? "");
  const [bankAccountNumber, setBankAccountNumber] = useState(current?.bankAccountNumber ?? "");
  const [payId, setPayId] = useState(current?.payId ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  function handleBsbInput(event) {
    const raw = event.target.value.replace(/[^\d-]/g, "").slice(0, 7);
    setBsb(raw);
  }

  function handleTabChange(method) {
    setPaymentMethod(method);
    setError("");
    setFieldErrors({});
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const body =
        paymentMethod === "bsb"
          ? { paymentMethod: "bsb", bankAccountName, bsb, bankAccountNumber }
          : { paymentMethod: "payid", bankAccountName, payId };

      const response = await fetch("/api/referral/bank/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();

      if (!response.ok) {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        throw new Error(result.error || "We couldn't save your payment details.");
      }

      setEditing(false);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We couldn't save your payment details.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setPaymentMethod(current?.payId ? "payid" : "bsb");
    setBankAccountName(current?.bankAccountName ?? "");
    setBsb(current?.bsb ?? "");
    setBankAccountNumber(current?.bankAccountNumber ?? "");
    setPayId(current?.payId ?? "");
    setError("");
    setFieldErrors({});
    setEditing(false);
  }

  if (!editing && hasDetails) {
    return (
      <div className="referral-bank-display">
        <div className="referral-bank-row">
          <div className="referral-bank-field">
            <span className="referral-bank-label">Account name</span>
            <span>{current.bankAccountName}</span>
          </div>
          {current.payId ? (
            <div className="referral-bank-field">
              <span className="referral-bank-label">PayID</span>
              <span>{current.payId}</span>
            </div>
          ) : (
            <>
              <div className="referral-bank-field">
                <span className="referral-bank-label">BSB</span>
                <span>{current.bsb}</span>
              </div>
              <div className="referral-bank-field">
                <span className="referral-bank-label">Account number</span>
                <span>{current.bankAccountNumber}</span>
              </div>
            </>
          )}
        </div>
        <button
          className="referral-secondary-btn referral-bank-edit-btn"
          onClick={() => setEditing(true)}
          type="button"
        >
          Edit payment details
        </button>
      </div>
    );
  }

  return (
    <form className="referral-auth-form" onSubmit={handleSubmit}>
      <div className="referral-login-tabs">
        <button
          type="button"
          className={`referral-login-tab${paymentMethod === "bsb" ? " is-active" : ""}`}
          onClick={() => handleTabChange("bsb")}
        >
          BSB + Account
        </button>
        <button
          type="button"
          className={`referral-login-tab${paymentMethod === "payid" ? " is-active" : ""}`}
          onClick={() => handleTabChange("payid")}
        >
          PayID
        </button>
      </div>

      <label className="referral-form-group">
        <span>Account name</span>
        <input
          value={bankAccountName}
          onChange={(e) => setBankAccountName(e.target.value)}
          placeholder="Name as shown on your bank account"
          type="text"
          autoComplete="name"
        />
        {fieldErrors.bankAccountName ? (
          <p className="referral-form-error">{fieldErrors.bankAccountName[0]}</p>
        ) : null}
      </label>

      {paymentMethod === "bsb" ? (
        <div className="referral-bank-two-col">
          <label className="referral-form-group">
            <span>BSB</span>
            <input
              value={bsb}
              onChange={handleBsbInput}
              placeholder="062-000"
              type="text"
              inputMode="numeric"
              autoComplete="off"
            />
            {fieldErrors.bsb ? (
              <p className="referral-form-error">{fieldErrors.bsb[0]}</p>
            ) : null}
          </label>

          <label className="referral-form-group">
            <span>Account number</span>
            <input
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 9))}
              placeholder="12345678"
              type="text"
              inputMode="numeric"
              autoComplete="off"
            />
            {fieldErrors.bankAccountNumber ? (
              <p className="referral-form-error">{fieldErrors.bankAccountNumber[0]}</p>
            ) : null}
          </label>
        </div>
      ) : (
        <label className="referral-form-group">
          <span>PayID</span>
          <input
            value={payId}
            onChange={(e) => setPayId(e.target.value)}
            placeholder="04XX XXX XXX or email@example.com"
            type="text"
            autoComplete="off"
          />
          <small className="referral-form-hint-inline">
            Your Australian mobile number or email registered as a PayID.
          </small>
          {fieldErrors.payId ? (
            <p className="referral-form-error">{fieldErrors.payId[0]}</p>
          ) : null}
        </label>
      )}

      {error ? <p className="referral-form-error">{error}</p> : null}

      <div className="referral-bank-actions">
        <button className="referral-primary-btn" disabled={loading} type="submit">
          {loading ? "Saving…" : "Save payment details"}
        </button>
        {hasDetails ? (
          <button
            className="referral-secondary-btn"
            disabled={loading}
            onClick={handleCancel}
            type="button"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
