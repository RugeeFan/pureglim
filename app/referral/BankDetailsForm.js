"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BankDetailsForm({ current }) {
  const router = useRouter();
  const hasDetails = Boolean(current?.bsb);
  const [editing, setEditing] = useState(!hasDetails);
  const [bankAccountName, setBankAccountName] = useState(current?.bankAccountName ?? "");
  const [bsb, setBsb] = useState(current?.bsb ?? "");
  const [bankAccountNumber, setBankAccountNumber] = useState(current?.bankAccountNumber ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  function handleBsbInput(event) {
    const raw = event.target.value.replace(/[^\d-]/g, "").slice(0, 7);
    setBsb(raw);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/referral/bank/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bankAccountName, bsb, bankAccountNumber }),
      });
      const result = await response.json();

      if (!response.ok) {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        throw new Error(result.error || "We couldn't save your bank details.");
      }

      setEditing(false);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We couldn't save your bank details.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setBankAccountName(current?.bankAccountName ?? "");
    setBsb(current?.bsb ?? "");
    setBankAccountNumber(current?.bankAccountNumber ?? "");
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
          <div className="referral-bank-field">
            <span className="referral-bank-label">BSB</span>
            <span>{current.bsb}</span>
          </div>
          <div className="referral-bank-field">
            <span className="referral-bank-label">Account number</span>
            <span>{current.bankAccountNumber}</span>
          </div>
        </div>
        <button
          className="referral-secondary-btn referral-bank-edit-btn"
          onClick={() => setEditing(true)}
          type="button"
        >
          Edit bank details
        </button>
      </div>
    );
  }

  return (
    <form className="referral-auth-form" onSubmit={handleSubmit}>
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

      {error ? <p className="referral-form-error">{error}</p> : null}

      <div className="referral-bank-actions">
        <button className="referral-primary-btn" disabled={loading} type="submit">
          {loading ? "Saving…" : "Save bank details"}
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
