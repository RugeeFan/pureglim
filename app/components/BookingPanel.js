"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  LoaderCircle,
  MailCheck,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
} from "lucide-react";
import AddressAutocomplete from "./AddressAutocomplete";
import ScrollPicker from "./ScrollPicker";
import AnimatedPrice from "./AnimatedPrice";
import DateScrollPicker from "./DateScrollPicker";
import TimeDropdown from "./TimeDropdown";
import SuccessAnimation from "./SuccessAnimation";
import {
  bathroomAddOn,
  bathroomOptions,
  bedroomOptions,
  deepCleaningAddOns,
  frequencyOptions,
  getCarpetSteamPrice,
  getRegularPrice,
  getValidBathroomOptions,
  REGULAR_PRICE_BUFFER,
  FIRST_CLEAN_PRICE_BUFFER,
  CLEANING_TIME_ESTIMATES,
  quoteBasePrices,
  quoteBaseRanges,
  services,
} from "../data/constants";

const roundTo5 = (n) => Math.round(n / 5) * 5;

function getServiceById(serviceId) {
  return services.find((service) => service.id === serviceId) ?? services[0];
}

function getSteps(serviceId) {
  if (serviceId === "commercial") {
    return ["select", "details", "contact", "review", "result"];
  }

  return ["select", "details", "quote", "contact", "review", "result"];
}

function getInitialFormState() {
  return {
    bedrooms: "1 Bedroom",
    bathrooms: "1 Bathroom",
    frequency: "Weekly",
    addOns: [],
    companyName: "",
    siteType: "",
    siteSchedule: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    discountCode: "",
    preferredDate: (() => {
      const n = new Date();
      return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
    })(),
    preferredTime: "Any time",
  };
}

function getServiceSubmissionType(serviceId) {
  if (serviceId === "deep") return "end_of_lease";
  return serviceId || "regular";
}

export default function BookingPanel({ isOpen, onClose, onGoHome, initialServiceId = null }) {
  const panelRef = useRef(null);
  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId);
  const [stepIndex, setStepIndex] = useState(initialServiceId ? 1 : 0);
  const [displayStepIndex, setDisplayStepIndex] = useState(initialServiceId ? 1 : 0);
  const [isStepTransitioning, setIsStepTransitioning] = useState(false);
  const [bookingBodyHeight, setBookingBodyHeight] = useState(null);
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submissionResult, setSubmissionResult] = useState(null);
  const stepTimerRef = useRef(null);
  const bookingBodyRef = useRef(null);
  const [form, setForm] = useState(getInitialFormState);
  const [discountState, setDiscountState] = useState({
    status: "idle",
    code: "",
    partnerName: "",
    discountAmount: 0,
    originalAmount: null,
    finalAmount: null,
    message: "",
  });
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddOnsModal, setShowAddOnsModal] = useState(false);

  const selectedService = selectedServiceId ? getServiceById(selectedServiceId) : null;
  const steps = getSteps(selectedServiceId);
  const currentStep = steps[displayStepIndex] ?? "select";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSelectedServiceId(initialServiceId);
    setStepIndex(initialServiceId ? 1 : 0);
    setDisplayStepIndex(initialServiceId ? 1 : 0);
    setShowValidation(false);
    setBookingBodyHeight(null);
    setIsSubmitting(false);
    setSubmitError("");
    setSubmissionResult(null);
    setForm(getInitialFormState());
    setDiscountState({
      status: "idle",
      code: "",
      partnerName: "",
      discountAmount: 0,
      originalAmount: null,
      finalAmount: null,
      message: "",
    });
  }, [initialServiceId, isOpen]);

  const quote = useMemo(() => {
    if (!selectedServiceId || selectedServiceId === "commercial") {
      return null;
    }

    if (!form.bedrooms || !form.bathrooms) {
      return null;
    }

    if (selectedServiceId === "regular") {
      if (form.frequency === "One-time") {
        const base = getRegularPrice(form.bedrooms, form.bathrooms, "One-time");
        return { amount: base, addOnsTotal: 0, base, isOneTime: true };
      }

      const base = getRegularPrice(form.bedrooms, form.bathrooms, form.frequency);
      const firstCleanPrice = getRegularPrice(form.bedrooms, form.bathrooms, "One-time");
      return {
        amount: base,
        addOnsTotal: 0,
        base,
        isOneTime: false,
        firstCleanPrice,
      };
    }

    // deep clean
    const base =
      quoteBasePrices.deep[form.bedrooms] +
      bathroomAddOn.deep[form.bathrooms];
    const addOnsTotal = form.addOns.reduce((total, addOnId) => {
      if (addOnId === "carpet_steam") return total + getCarpetSteamPrice(form.bedrooms);
      const addOn = deepCleaningAddOns.find((item) => item.id === addOnId);
      return total + (addOn?.price ?? 0);
    }, 0);

    return {
      amount: base + addOnsTotal,
      addOnsTotal,
      base,
    };
  }, [form, selectedServiceId]);

  const pricingSummary = useMemo(() => {
    if (!quote) return null;

    const discountAmount =
      discountState.status === "valid" ? discountState.discountAmount : 0;
    const originalAmount = quote.amount;
    const finalAmount = Math.max(originalAmount - discountAmount, 0);

    return {
      originalAmount,
      discountAmount,
      finalAmount,
      code: discountState.status === "valid" ? discountState.code : "",
      partnerName:
        discountState.status === "valid" ? discountState.partnerName : "",
    };
  }, [discountState, quote]);

  const quoteRange = useMemo(() => {
    if (!selectedServiceId || selectedServiceId === "commercial" || !form.bedrooms || !form.bathrooms) return null;

    if (selectedServiceId === "regular") {
      if (form.frequency === "One-time") {
        const price = getRegularPrice(form.bedrooms, form.bathrooms, "One-time");
        return { low: price, high: price + FIRST_CLEAN_PRICE_BUFFER, isOneTime: true };
      }
      const price = getRegularPrice(form.bedrooms, form.bathrooms, form.frequency);
      const firstCleanPrice = getRegularPrice(form.bedrooms, form.bathrooms, "One-time");
      return {
        low: price,
        high: price + REGULAR_PRICE_BUFFER,
        isOneTime: false,
        firstClean: { low: firstCleanPrice, high: firstCleanPrice + FIRST_CLEAN_PRICE_BUFFER },
      };
    }

    const r = quoteBaseRanges.deep[form.bedrooms];
    const extra = bathroomAddOn.deep[form.bathrooms];
    const addOnsTotal = form.addOns.reduce((sum, id) => {
      if (id === "carpet_steam") return sum + getCarpetSteamPrice(form.bedrooms);
      return sum + (deepCleaningAddOns.find((a) => a.id === id)?.price ?? 0);
    }, 0);
    return { low: r.low + extra + addOnsTotal, high: r.high + extra + addOnsTotal };
  }, [form, selectedServiceId]);

  const validBathroomOptions = selectedServiceId === "regular"
    ? getValidBathroomOptions(form.bedrooms)
    : bathroomOptions;

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleBedroomChange(name, value) {
    setForm((current) => {
      const updated = { ...current, [name]: value };
      if (selectedServiceId === "regular") {
        const valid = getValidBathroomOptions(value);
        if (current.bathrooms && !valid.includes(current.bathrooms)) {
          updated.bathrooms = "";
        }
      }
      return updated;
    });
  }

  function updateDiscountCode(value) {
    setForm((current) => ({ ...current, discountCode: value }));
    setDiscountState((current) => {
      const normalized = value.trim().toUpperCase().replace(/\s+/g, "");
      if (current.status === "valid" && current.code === normalized) {
        return current;
      }

      return {
        status: "idle",
        code: "",
        partnerName: "",
        discountAmount: 0,
        originalAmount: null,
        finalAmount: null,
        message: "",
      };
    });
  }

  function toggleAddOn(addOnId) {
    setForm((current) => ({
      ...current,
      addOns: current.addOns.includes(addOnId)
        ? current.addOns.filter((item) => item !== addOnId)
        : [...current.addOns, addOnId],
    }));
  }

  function selectService(serviceId, jumpToDetails = true) {
    setSelectedServiceId(serviceId);
    setShowValidation(false);
    setSubmitError("");
    setDiscountState({
      status: "idle",
      code: "",
      partnerName: "",
      discountAmount: 0,
      originalAmount: null,
      finalAmount: null,
      message: "",
    });
    setForm((current) => ({ ...current, discountCode: "" }));
    setStepIndex(jumpToDetails ? 1 : 0);
    setDisplayStepIndex(jumpToDetails ? 1 : 0);
  }

  async function applyDiscountCode() {
    const code = form.discountCode.trim();
    if (!code || !quote) {
      setDiscountState({
        status: "invalid",
        code: "",
        partnerName: "",
        discountAmount: 0,
        originalAmount: null,
        finalAmount: null,
        message: "Enter a referral code to apply a discount.",
      });
      return false;
    }

    setIsApplyingDiscount(true);
    setDiscountState((current) => ({
      ...current,
      status: "checking",
      message: "",
    }));

    try {
      const response = await fetch("/api/referral/code/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          amount: quote.amount,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.valid) {
        throw new Error(result.error || "That referral code doesn't exist. Please double-check it.");
      }

      setForm((current) => ({ ...current, discountCode: result.code }));
      setDiscountState({
        status: "valid",
        code: result.code,
        partnerName: result.referrerName,
        discountAmount: result.discountAmount,
        originalAmount: result.originalAmount,
        finalAmount: result.finalAmount,
        message: `✓ ${result.code} applied — $${result.discountAmount} off your first clean.`,
      });
      return true;
    } catch (error) {
      setDiscountState({
        status: "invalid",
        code: "",
        partnerName: "",
        discountAmount: 0,
        originalAmount: null,
        finalAmount: null,
        message:
          error instanceof Error
            ? error.message
            : "That referral code doesn't exist. Please double-check it.",
      });
      return false;
    } finally {
      setIsApplyingDiscount(false);
    }
  }

  function canContinue() {
    if (currentStep === "select") {
      return Boolean(selectedServiceId);
    }

    if (currentStep === "quote") {
      if (selectedServiceId === "commercial") {
        return true;
      }

      return Boolean(form.bedrooms && form.bathrooms);
    }

    if (currentStep === "contact") {
      const baseContactValid = Boolean(
        form.name.trim() &&
        form.phone.trim() &&
        form.email.trim() &&
        form.address.trim(),
      );

      if (!baseContactValid) {
        return false;
      }

      if (selectedServiceId === "commercial") {
        return Boolean(form.siteType.trim());
      }

      return true;
    }

    if (currentStep === "review") return true;

    return true;
  }

  function getPrimaryButtonLabel() {
    if (currentStep === "details") {
      return selectedServiceId === "commercial" ? "Request a site visit" : "See my estimate";
    }
    if (currentStep === "quote") {
      if (
        selectedServiceId !== "commercial" &&
        form.discountCode.trim() &&
        discountState.status !== "valid"
      ) {
        return isApplyingDiscount ? "Checking…" : "Verify referral code";
      }
      return selectedService?.quote.nextLabel ?? "Next";
    }
    if (currentStep === "contact") return selectedService?.quote.nextLabel ?? "Review";
    if (currentStep === "review") {
      return isSubmitting ? "Sending…" : "Send request";
    }
    return "Done";
  }

  async function submitRequest() {
    if (!selectedService) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const payload = {
      serviceType: getServiceSubmissionType(selectedService.id),
      customerName: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      bedrooms: selectedService.id === "commercial" ? null : form.bedrooms,
      bathrooms: selectedService.id === "commercial" ? null : form.bathrooms,
      frequency: selectedService.id === "regular" ? form.frequency : null,
      addOns: selectedService.id === "deep" ? form.addOns : [],
      companyName: selectedService.id === "commercial" ? form.companyName.trim() : "",
      siteType: selectedService.id === "commercial" ? form.siteType.trim() : "",
      siteSchedule: selectedService.id === "commercial" ? form.siteSchedule.trim() : "",
      notes: form.notes.trim(),
      discountCode:
        selectedService.id !== "commercial" && discountState.status === "valid"
          ? discountState.code
          : "",
      preferredDate: form.preferredDate || "",
      preferredTime: form.preferredTime || "",
      estimatedPrice: quote?.amount ?? null,
    };

    try {
      const response = await fetch("/api/quote-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "We couldn't submit your request just now.");
      }

      setSubmissionResult(result);
      setStepIndex((current) => Math.min(current + 1, steps.length - 1));
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "We couldn't submit your request just now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleNext() {
    if (!canContinue()) {
      setShowValidation(true);
      return;
    }

    setShowValidation(false);
    setSubmitError("");

    if (currentStep === "review") {
      await submitRequest();
      return;
    }

    if (
      currentStep === "quote" &&
      selectedServiceId !== "commercial" &&
      form.discountCode.trim() &&
      discountState.status !== "valid"
    ) {
      await applyDiscountCode();
      return;
    }

    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function handlePrevious() {
    setShowValidation(false);
    setSubmitError("");

    if (displayStepIndex === 0) {
      return;
    }

    const nextIndex = displayStepIndex - 1;
    setStepIndex(nextIndex);

    if (steps[nextIndex] === "select") {
      setSelectedServiceId(null);
    }
  }

  useEffect(() => {
    if (!isOpen || stepIndex === displayStepIndex) return;

    setIsStepTransitioning(true);
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current);

    stepTimerRef.current = setTimeout(() => {
      setDisplayStepIndex(stepIndex);
      setIsStepTransitioning(false);
      stepTimerRef.current = null;
    }, 300);

    return () => {
      if (stepTimerRef.current) {
        clearTimeout(stepTimerRef.current);
        stepTimerRef.current = null;
      }
    };
  }, [displayStepIndex, isOpen, stepIndex]);

  useEffect(() => {
    if (!isOpen || !bookingBodyRef.current) return;

    const element = bookingBodyRef.current;
    const updateHeight = () => setBookingBodyHeight(element.getBoundingClientRect().height);
    updateHeight();

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [displayStepIndex, isOpen, isStepTransitioning, selectedServiceId, submitError, submissionResult]);

  useLayoutEffect(() => {
    if (!isOpen || !bookingBodyRef.current) return;

    const element = bookingBodyRef.current;
    let frameTwo = null;
    const syncHeight = () => setBookingBodyHeight(element.getBoundingClientRect().height);
    syncHeight();

    const frameOne = requestAnimationFrame(() => {
      syncHeight();
      frameTwo = requestAnimationFrame(syncHeight);
    });

    const timeoutId = setTimeout(syncHeight, 220);

    return () => {
      cancelAnimationFrame(frameOne);
      if (frameTwo) cancelAnimationFrame(frameTwo);
      clearTimeout(timeoutId);
    };
  }, [displayStepIndex, isOpen, selectedServiceId, submitError, submissionResult]);

  useEffect(() => {
    if (!isOpen || !panelRef.current) return;

    panelRef.current.scrollTop = 0;
    if (typeof window !== "undefined" && window.scrollY > 0) {
      window.scrollTo(0, 0);
    }
  }, [stepIndex, isOpen]);

  useEffect(() => {
    return () => {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    };
  }, []);

  return (
    <section
      aria-hidden={!isOpen}
      className="booking-panel"
      ref={panelRef}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="booking-shell booking-shell-wide">
        <div className="booking-head">
          <div>
            <div className="booking-progress" aria-hidden="true">
              {steps.map((step, index) => (
                <span
                  className={displayStepIndex >= index ? "is-active" : ""}
                  key={step}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          className="booking-body-wrap"
          style={bookingBodyHeight ? { height: `${bookingBodyHeight}px` } : undefined}
        >
          <div className="booking-body" ref={bookingBodyRef}>
            <div
              className={`booking-stage ${isStepTransitioning ? "is-transitioning" : "is-visible"}`}
              key={`${selectedServiceId ?? "none"}-${currentStep}`}
            >
              {currentStep === "select" && (
                <>
                  <div className="booking-copy booking-copy-wide">
                    <h2>What kind of clean are you after?</h2>
                    <p>
                      Choose the option that fits your space. We&apos;ll take you
                      through the rest.
                    </p>
                  </div>

                  <div className="service-selection-grid">
                    {services.map((service) => (
                      <article
                        className={`service-selection-card ${service.id === "regular" ? "is-featured" : ""} ${
                          selectedServiceId === service.id ? "is-selected" : ""
                        }`}
                        key={service.id}
                      >
                        <div className="service-selection-top">
                          <span className="service-card-badge">{service.badge}</span>
                        </div>

                        <div className="service-selection-copy">
                          <h3>{service.title}</h3>
                          <p>{service.cardDescription}</p>
                        </div>

                        <div className="service-selection-actions">
                          <button
                            className="secondary-button service-selection-learn"
                            onClick={() => selectService(service.id)}
                            type="button"
                          >
                            {service.learnMoreLabel}
                            <ArrowUpRight size={16} />
                          </button>
                          <button
                            className="primary-button service-selection-cta"
                            onClick={() => selectService(service.id)}
                            type="button"
                          >
                            {service.ctaLabel}
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}

              {currentStep === "details" && selectedService && (
                <div className="service-journey-layout">
                  <div className="booking-copy booking-copy-wide service-journey-copy">
                    <h2>{selectedService.detailTitle}</h2>
                    <p>{selectedService.detailIntro}</p>
                  </div>

                  <div className="service-journey-grid">
                    <article className="service-journey-card service-journey-card-hero">
                      <span className="service-card-badge">{selectedService.panelLabel}</span>
                      <strong>{selectedService.summary}</strong>
                      <ul className="service-bullet-list">
                        {selectedService.highlights.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </article>

                    <article className="service-journey-card">
                      <span>{selectedService.includedTitle}</span>
                      <div className="service-checklist-grid">
                        {selectedService.included.map((item) => (
                          <div className="service-checklist-item" key={item}>
                            <CheckCircle2 size={16} />
                            <p>{item}</p>
                          </div>
                        ))}
                      </div>
                    </article>

                    {selectedService.guarantee ? (
                      <article className="service-journey-card service-journey-card-guarantee">
                        <span>{selectedService.guarantee.label}</span>
                        <strong>{selectedService.guarantee.title}</strong>
                        <p>{selectedService.guarantee.copy}</p>
                        <div className="service-guarantee-inline">
                          <ShieldCheck size={18} />
                          Free re-clean if needed
                        </div>
                      </article>
                    ) : null}

                    {selectedService.commercialUseCases ? (
                      <article className="service-journey-card">
                        <span>Good fit for</span>
                        <div className="service-use-case-row">
                          {selectedService.commercialUseCases.map((item) => (
                            <span key={item}>{item}</span>
                          ))}
                        </div>
                      </article>
                    ) : null}
                  </div>
                </div>
              )}

              {currentStep === "quote" && selectedService && (
                <>
                  <div className="booking-copy booking-copy-wide">
                    <h2>Get your estimate.</h2>
                    <p>{selectedService.quote.prompt}</p>
                  </div>

                  {selectedService.id === "regular" ? (
                    <div className="quote-grid quote-grid-regular">
                      <div className="quote-group quote-group-wide">
                        <span>Bedrooms</span>
                        <ScrollPicker
                          name="bedrooms"
                          onChange={handleBedroomChange}
                          options={bedroomOptions}
                          placeholder="Please scroll to choose"
                          value={form.bedrooms}
                        />
                        <div className="choice-grid choice-grid-5col">
                          {bedroomOptions.map((option) => (
                            <button
                              className={`choice-card ${form.bedrooms === option ? "selected" : ""}`}
                              key={option}
                              onClick={() => handleBedroomChange("bedrooms", option)}
                              type="button"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="quote-group quote-group-wide">
                        <span>Bathrooms</span>
                        <ScrollPicker
                          name="bathrooms"
                          onChange={updateField}
                          options={validBathroomOptions}
                          placeholder="Please scroll to choose"
                          value={form.bathrooms}
                        />
                        <div className="choice-grid choice-grid-4col">
                          {bathroomOptions.map((option) => {
                            const isValid = validBathroomOptions.includes(option);
                            return (
                              <button
                                className={`choice-card ${form.bathrooms === option ? "selected" : ""} ${!isValid ? "disabled" : ""}`}
                                disabled={!isValid}
                                key={option}
                                onClick={() => isValid && updateField("bathrooms", option)}
                                type="button"
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="quote-group quote-group-wide">
                        <span>Frequency</span>
                        <div className="choice-grid frequency-grid">
                          {frequencyOptions.map((option) => (
                            <button
                              className={`choice-card ${form.frequency === option ? "selected" : ""}`}
                              key={option}
                              onClick={() => updateField("frequency", option)}
                              type="button"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="quote-grid quote-grid-deep">
                      <div className="quote-group">
                        <span>Bedrooms</span>
                        <ScrollPicker
                          name="bedrooms"
                          onChange={updateField}
                          options={bedroomOptions}
                          placeholder="Please scroll to choose"
                          value={form.bedrooms}
                        />
                        <div className="choice-grid">
                          {bedroomOptions.map((option) => (
                            <button
                              className={`choice-card ${form.bedrooms === option ? "selected" : ""}`}
                              key={option}
                              onClick={() => updateField("bedrooms", option)}
                              type="button"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="quote-group">
                        <span>Bathrooms</span>
                        <ScrollPicker
                          name="bathrooms"
                          onChange={updateField}
                          options={bathroomOptions}
                          placeholder="Please scroll to choose"
                          value={form.bathrooms}
                        />
                        <div className="choice-grid">
                          {bathroomOptions.map((option) => (
                            <button
                              className={`choice-card ${form.bathrooms === option ? "selected" : ""}`}
                              key={option}
                              onClick={() => updateField("bathrooms", option)}
                              type="button"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {quoteRange && (
                    <div className="quote-live-estimate">
                      <div className="quote-estimate-layout">
                        <div className="quote-estimate-left">
                          <span className="quote-estimate-label">Estimate</span>
                          {selectedServiceId === "deep" ? (
                            <div className="quote-estimate-range">
                              <span className="quote-estimate-from">From</span>
                              <AnimatedPrice amount={quoteRange.low} />
                            </div>
                          ) : (
                            <div className="quote-estimate-range">
                              <AnimatedPrice amount={quoteRange.low} />
                              <span className="quote-estimate-sep">–</span>
                              <AnimatedPrice amount={quoteRange.high} />
                            </div>
                          )}
                          {pricingSummary?.discountAmount ? (
                            <p className="quote-live-detail">Referral -{`$${pricingSummary.discountAmount}`} · first clean only</p>
                          ) : null}
                          {selectedServiceId === "deep" && (
                            <p className="quote-live-detail">
                              Extra services available.{" "}
                              <button type="button" className="quote-details-link" onClick={() => setShowAddOnsModal(true)}>
                                View add-ons & pricing
                              </button>
                            </p>
                          )}
                          {selectedServiceId === "regular" && form.bathrooms && CLEANING_TIME_ESTIMATES[form.bathrooms] && (
                            <p className="quote-live-detail">{CLEANING_TIME_ESTIMATES[form.bathrooms]} with 2 cleaners</p>
                          )}
                        </div>
                        <div className="quote-estimate-right">
                          {selectedServiceId === "regular" && !quoteRange.isOneTime ? (
                            pricingSummary?.discountAmount ? (
                              <div className="first-visit-deal">
                                <p className="first-visit-label">First visit price</p>
                                <span className="first-visit-strike">
                                  <AnimatedPrice amount={quoteRange.firstClean.low} />–<AnimatedPrice amount={quoteRange.firstClean.high} />
                                </span>
                                <div className="first-visit-deal-row">
                                  <span className="first-visit-discounted">
                                    <AnimatedPrice amount={Math.max(0, quoteRange.firstClean.low - pricingSummary.discountAmount)} />–<AnimatedPrice amount={Math.max(0, quoteRange.firstClean.high - pricingSummary.discountAmount)} />
                                  </span>
                                  <span className="first-visit-savings-badge">Save ${pricingSummary.discountAmount}</span>
                                </div>
                                <p className="first-visit-ongoing">
                                  Then <AnimatedPrice amount={quoteRange.low} />–<AnimatedPrice amount={quoteRange.high} /> each ongoing visit.{" "}
                                  <button type="button" className="quote-details-link" onClick={() => setShowDetailsModal(true)}>View details</button>
                                </p>
                              </div>
                            ) : (
                              <p className="quote-estimate-note">
                                Your first visit will be{" "}
                                <AnimatedPrice amount={quoteRange.firstClean.low} />–<AnimatedPrice amount={quoteRange.firstClean.high} />{" "}
                                — a little more to work through than usual, since we&apos;re starting fresh. Once we&apos;re into the rhythm, each visit is{" "}
                                <AnimatedPrice amount={quoteRange.low} />–<AnimatedPrice amount={quoteRange.high} />.{" "}
                                Estimate based on your selections.{" "}
                                <button type="button" className="quote-details-link" onClick={() => setShowDetailsModal(true)}>
                                  View details
                                </button>
                              </p>
                            )
                          ) : (
                            <p className="quote-live-disclaimer">
                              Estimate based on your selections.{" "}
                              <button type="button" className="quote-details-link" onClick={() => setShowDetailsModal(true)}>
                                View details
                              </button>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedService.id !== "commercial" && selectedService.id !== "deep" && (
                    <div className="quote-referral-section">
                      <div className="referral-input-row">
                        <input
                          name="discountCode"
                          onChange={(event) => updateDiscountCode(event.target.value)}
                          placeholder="Referral code (optional)"
                          type="text"
                          value={form.discountCode}
                        />
                        {discountState.status === "valid" && discountState.message ? (
                          <span className="discount-applied-inline">{discountState.message}</span>
                        ) : null}
                      </div>
                      {discountState.status === "invalid" && discountState.message ? (
                        <p className="discount-code-feedback is-error">{discountState.message}</p>
                      ) : null}
                    </div>
                  )}

                </>
              )}

              {currentStep === "contact" && selectedService && (
                <>
                  <div className="booking-copy booking-copy-wide booking-copy-compact">
                    <h2>
                      {selectedService.id === "commercial"
                        ? "Tell us about your space."
                        : "Almost done — just a few details."}
                    </h2>
                  </div>

                  <form className="booking-form" onSubmit={(event) => event.preventDefault()}>
                    {selectedService.id === "commercial" ? (
                      <>
                        <label className="field">
                          <span>Company / contact</span>
                          <input
                            name="companyName"
                            onChange={(event) => updateField("companyName", event.target.value)}
                            placeholder="Business name or contact"
                            type="text"
                            value={form.companyName}
                          />
                        </label>

                        <label className={`field ${showValidation && !form.siteType.trim() ? "has-error" : ""}`}>
                          <span>Site type</span>
                          <input
                            name="siteType"
                            onChange={(event) => updateField("siteType", event.target.value)}
                            placeholder="Office, retail, shared space..."
                            type="text"
                            value={form.siteType}
                          />
                        </label>

                        <label className="field field-wide">
                          <span>Preferred schedule</span>
                          <input
                            name="siteSchedule"
                            onChange={(event) => updateField("siteSchedule", event.target.value)}
                            placeholder="Daily, weekly, after-hours..."
                            type="text"
                            value={form.siteSchedule}
                          />
                        </label>
                      </>
                    ) : null}

                    <label className={`field ${showValidation && !form.name.trim() ? "has-error" : ""}`}>
                      <span>Full name</span>
                      <input
                        name="name"
                        onChange={(event) => updateField("name", event.target.value)}
                        placeholder="Your full name"
                        type="text"
                        value={form.name}
                      />
                    </label>

                    <label className={`field ${showValidation && !form.phone.trim() ? "has-error" : ""}`}>
                      <span>Phone</span>
                      <input
                        name="phone"
                        onChange={(event) => updateField("phone", event.target.value)}
                        placeholder="+61 4..."
                        type="tel"
                        value={form.phone}
                      />
                    </label>

                    <label className={`field ${showValidation && !form.email.trim() ? "has-error" : ""}`}>
                      <span>Email</span>
                      <input
                        name="email"
                        onChange={(event) => updateField("email", event.target.value)}
                        placeholder="you@example.com"
                        type="email"
                        value={form.email}
                      />
                    </label>

                    <AddressAutocomplete
                      value={form.address}
                      onChange={(formatted) => updateField("address", formatted)}
                      showValidation={showValidation}
                      ready={isOpen && currentStep === "contact"}
                    />

                    <div className="schedule-section field-wide">
                      <div className="schedule-row schedule-row-mobile-stack">
                        <div className="schedule-col">
                          <span className="schedule-label">Preferred start date</span>
                          <DateScrollPicker value={form.preferredDate} onChange={updateField} />
                        </div>
                        <div className="schedule-col">
                          <span className="schedule-label">Preferred start time</span>
                          <TimeDropdown value={form.preferredTime} onChange={updateField} />
                        </div>
                      </div>
                      <p className="field-hint">
                        This is your preferred window. We&apos;ll confirm the exact timing with you directly.
                      </p>
                    </div>

                    <label className="field field-wide">
                      <span>Notes / Special requirements</span>
                      <textarea
                        name="notes"
                        onChange={(event) => updateField("notes", event.target.value)}
                        placeholder="Parking, access, areas to focus on, or anything else we should know."
                        value={form.notes}
                      />
                    </label>
                  </form>

                  {submitError ? <p className="submit-feedback is-error">{submitError}</p> : null}
                </>
              )}

              {currentStep === "review" && selectedService && (
                <>
                  <div className="booking-copy booking-copy-wide">
                    <h2>Take a look before you send.</h2>
                    <p>Everything look right? You can still go back and change anything.</p>
                  </div>

                  <div className="review-grid">
                    <div className="review-card">
                      <span className="review-section-label">Service</span>
                      <span className="review-section-value">
                        {selectedService.id === "regular"
                          ? (form.frequency === "One-time" ? "One Time Cleaning" : "Regular Cleaning")
                          : selectedService.title}
                      </span>
                      {quoteRange && (
                        <span className="review-price">
                          {selectedService.id === "deep"
                            ? `From $${quoteRange.low}`
                            : `$${quoteRange.low}–$${quoteRange.high}`}
                        </span>
                      )}
                      {selectedService.id === "commercial" && (
                        <span className="review-section-value">On-site quote</span>
                      )}
                    </div>

                    <div className="review-card">
                      <span className="review-section-label">Property</span>
                      {form.bedrooms && <span className="review-section-value">{form.bedrooms}</span>}
                      {form.bathrooms && <span className="review-section-value">{form.bathrooms}</span>}
                      {selectedService.id === "regular" && form.frequency && (
                        <span className="review-section-value">{form.frequency}</span>
                      )}
                      {selectedService.id === "commercial" && form.siteType && (
                        <span className="review-section-value">{form.siteType}</span>
                      )}
                      {selectedService.id === "commercial" && form.siteSchedule && (
                        <span className="review-section-value">{form.siteSchedule}</span>
                      )}
                      {selectedService.id === "deep" && form.addOns.length > 0 && (
                        <>
                          {deepCleaningAddOns
                            .filter((item) => form.addOns.includes(item.id))
                            .map((item) => (
                              <span key={item.id} className="review-section-value">
                                {item.label} {item.priceLabel ?? `+$${item.price}`}
                              </span>
                            ))}
                        </>
                      )}
                    </div>

                    {pricingSummary?.discountAmount ? (
                      <div className="review-card review-card-wide review-card-deal">
                        <span className="review-section-label">Discount</span>
                        {selectedService.id === "regular" && !quoteRange?.isOneTime && quoteRange?.firstClean ? (
                          <div className="review-deal-inner">
                            <span className="review-deal-code">{pricingSummary.code}</span>
                            <div className="review-deal-pricing">
                              <span className="review-deal-first-visit">First visit</span>
                              <span className="review-deal-strike">
                                ${quoteRange.firstClean.low}–${quoteRange.firstClean.high}
                              </span>
                              <div className="review-deal-bottom">
                                <span className="review-deal-price">
                                  ${Math.max(0, quoteRange.firstClean.low - pricingSummary.discountAmount)}–${Math.max(0, quoteRange.firstClean.high - pricingSummary.discountAmount)}
                                </span>
                                <span className="review-deal-badge">Save ${pricingSummary.discountAmount}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="review-deal-inner">
                            <span className="review-deal-code">{pricingSummary.code}</span>
                            <div className="review-deal-bottom">
                              <span className="review-deal-price">${pricingSummary.finalAmount}</span>
                              <span className="review-deal-badge">Save ${pricingSummary.discountAmount}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}

                    <div className="review-card">
                      <span className="review-section-label">Your details</span>
                      <span className="review-section-value">{form.name}</span>
                      <span className="review-section-value">{form.phone}</span>
                      <span className="review-section-value">{form.email}</span>
                      <span className="review-section-value">{form.address}</span>
                    </div>

                    <div className="review-card">
                      <span className="review-section-label">Preferred schedule</span>
                      {form.preferredDate ? (
                        <span className="review-section-value">
                          {(() => {
                            const [y, m, d] = form.preferredDate.split("-").map(Number);
                            return new Intl.DateTimeFormat("en-AU", {
                              weekday: "short", day: "numeric", month: "short", year: "numeric",
                            }).format(new Date(y, m - 1, d));
                          })()}
                        </span>
                      ) : (
                        <span className="review-section-value">No date specified</span>
                      )}
                      <span className="review-section-value">{form.preferredTime}</span>
                    </div>

                    {form.notes ? (
                      <div className="review-card review-card-wide">
                        <span className="review-section-label">Notes</span>
                        <span className="review-section-value">{form.notes}</span>
                      </div>
                    ) : null}
                  </div>

                  {submitError ? <p className="submit-feedback is-error">{submitError}</p> : null}
                </>
              )}

              {currentStep === "result" && selectedService && (
                <div className="result-success">
                  <SuccessAnimation />

                  <div className="result-success-header">
                    <h2 className="result-success-title">
                      You&apos;re all set.
                    </h2>
                    <p className="result-success-ref">
                      {submissionResult?.referenceId ? `Ref ${submissionResult.referenceId} — ` : ""}
                      We&apos;ll be in touch within 24 hours to confirm everything.
                    </p>
                    <p className="result-success-sub">
                      Or reach us directly below.
                    </p>
                  </div>

                  <div className="result-summary-card">
                    <div className="result-summary-top">
                      {selectedService.id !== "commercial" && quoteRange && (
                        <strong className="result-summary-price">
                          {selectedService.id === "deep"
                            ? `From $${quoteRange.low}`
                            : `$${quoteRange.low}–$${quoteRange.high}`}
                        </strong>
                      )}
                      {selectedService.id === "commercial" && (
                        <strong className="result-summary-price result-summary-price-sm">On-site quote</strong>
                      )}
                      <div className="result-chip-row">
                        <span>
                          {selectedService.id === "regular"
                            ? (form.frequency === "One-time" ? "One Time Cleaning" : "Regular Cleaning")
                            : selectedService.title}
                        </span>
                        {form.bedrooms && <span>{form.bedrooms}</span>}
                        {form.bathrooms && <span>{form.bathrooms}</span>}
                        {selectedService.id === "regular" && form.frequency && <span>{form.frequency}</span>}
                        {selectedService.id === "commercial" && form.siteType && <span>{form.siteType}</span>}
                        {selectedService.id === "deep" && form.addOns.length > 0 &&
                          deepCleaningAddOns
                            .filter((item) => form.addOns.includes(item.id))
                            .map((item) => <span key={item.id}>{item.label}</span>)
                        }
                        {pricingSummary?.code ? <span>{pricingSummary.code}</span> : null}
                      </div>
                    </div>
                    {(selectedService.id === "regular" && !quoteRange?.isOneTime && quoteRange?.firstClean) || pricingSummary?.discountAmount ? (
                      <div className="result-deal-row">
                        <span className="result-deal-first-visit">First visit</span>
                        {selectedService.id === "regular" && !quoteRange?.isOneTime && quoteRange?.firstClean ? (
                          pricingSummary?.discountAmount ? (
                            <>
                              <span className="result-deal-strike">
                                ${quoteRange.firstClean.low}–${quoteRange.firstClean.high}
                              </span>
                              <span className="result-deal-price">
                                ${Math.max(0, quoteRange.firstClean.low - pricingSummary.discountAmount)}–${Math.max(0, quoteRange.firstClean.high - pricingSummary.discountAmount)}
                              </span>
                              <span className="review-deal-badge">Save ${pricingSummary.discountAmount}</span>
                            </>
                          ) : (
                            <span className="result-deal-price">
                              ${quoteRange.firstClean.low}–${quoteRange.firstClean.high}
                            </span>
                          )
                        ) : (
                          <>
                            <span className="result-deal-price">${pricingSummary.finalAmount}</span>
                            <span className="review-deal-badge">Save ${pricingSummary.discountAmount}</span>
                          </>
                        )}
                      </div>
                    ) : null}
                    <div className="result-chip-row result-chip-row-muted">
                      <span>{form.name}</span>
                      <span>{form.phone}</span>
                      <span>{form.email}</span>
                      <span>{form.address}</span>
                      {form.preferredDate && (
                        <span>
                          {(() => {
                            const [y, m, d] = form.preferredDate.split("-").map(Number);
                            return new Intl.DateTimeFormat("en-AU", {
                              weekday: "short", day: "numeric", month: "short",
                            }).format(new Date(y, m - 1, d));
                          })()}
                        </span>
                      )}
                      {form.preferredTime && <span>{form.preferredTime}</span>}
                    </div>
                  </div>

                  <div className="result-contact-row">
                    <a
                      className="result-contact-btn"
                      href="mailto:pureglimsydney@gmail.com"
                    >
                      <Mail size={16} />
                      Email
                    </a>
                    <a
                      className="result-contact-btn"
                      href="https://m.me/pureglim"
                      rel="noreferrer"
                      target="_blank"
                    >
                      <MessageSquare size={16} />
                      Messenger
                    </a>
                    <a className="result-contact-btn" href="sms:?&body=Hello%20PureGlim">
                      <Phone size={16} />
                      SMS
                    </a>
                  </div>

                  <button className="ghost-button result-done-btn" onClick={onGoHome} type="button">
                    Done
                  </button>
                </div>
              )}
            </div>

            {currentStep !== "select" && currentStep !== "result" ? (
              <div className="booking-footer">
                {displayStepIndex > 0 ? (
                  <button
                    className="ghost-button"
                    disabled={isSubmitting}
                    onClick={handlePrevious}
                    type="button"
                  >
                    Previous
                  </button>
                ) : (
                  <span className="booking-hint" />
                )}

                <button
                  className="primary-button"
                  disabled={isStepTransitioning || isSubmitting || isApplyingDiscount}
                  onClick={handleNext}
                  type="button"
                >
                  {(isSubmitting || isApplyingDiscount) ? <LoaderCircle className="spin" size={18} /> : null}
                  {getPrimaryButtonLabel()}
                  {!(isSubmitting || isApplyingDiscount) ? <ArrowRight size={18} /> : null}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {showAddOnsModal && createPortal(
        <div className="quote-modal-overlay" onClick={() => setShowAddOnsModal(false)}>
          <div className="quote-modal quote-modal-addons" onClick={(e) => e.stopPropagation()}>
            <button className="quote-modal-close" onClick={() => setShowAddOnsModal(false)} type="button">✕</button>
            <h3>Add-ons & extras</h3>
            <p className="quote-modal-addons-note">These are optional extras on top of the base price. Final pricing is confirmed with you before work begins.</p>
            <div className="quote-modal-addons-grid">
              {deepCleaningAddOns.map((item) => (
                <div key={item.id} className="quote-modal-addon-row">
                  <span className="quote-modal-addon-label">{item.label}</span>
                  <span className="quote-modal-addon-price">{item.priceLabel ?? `+$${item.price}`}</span>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

      {showDetailsModal && createPortal(
        <div className="quote-modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="quote-modal" onClick={(e) => e.stopPropagation()}>
            <button className="quote-modal-close" onClick={() => setShowDetailsModal(false)} type="button">✕</button>
            <h3>About your estimate</h3>
            <ul>
              <li>This is an estimate based on your selections. Your final price is confirmed with you before work begins.</li>
              {selectedServiceId === "regular" && !quoteRange?.isOneTime && (
                <li>Your first visit is priced a little higher — it takes longer to get a home to baseline. Once we&apos;re into the routine, each visit stays within the ongoing estimate.</li>
              )}
              {form.bathrooms && CLEANING_TIME_ESTIMATES[form.bathrooms] && (
                <li>Based on your bathroom count, expect {CLEANING_TIME_ESTIMATES[form.bathrooms]} per visit with 2 cleaners.</li>
              )}
              {discountState.status === "valid" && (
                <li>Your referral discount of ${discountState.discountAmount} applies to your first clean only.</li>
              )}
              <li>Arrival times may vary slightly depending on travel between jobs.</li>
            </ul>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
