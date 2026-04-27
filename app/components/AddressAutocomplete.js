"use client";

import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const SYDNEY_BOUNDS = { north: -33.4, south: -34.2, east: 151.4, west: 150.9 };

function cleanAddress(formatted) {
  return formatted.replace(/, Australia$/, "").trim();
}

export default function AddressAutocomplete({ value, onChange, showValidation, ready = false }) {
  const inputRef = useRef(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; });

  const [googleReady, setGoogleReady] = useState(false);
  const [googleError, setGoogleError] = useState(false);
  const [typed, setTyped] = useState(false); // user typed but hasn't selected

  useEffect(() => {
    if (!GOOGLE_API_KEY || !ready) return;

    window.gm_authFailure = () => {
      setGoogleError(true);
      setGoogleReady(false);
    };

    setOptions({ key: GOOGLE_API_KEY, version: "weekly", language: "en" });
    importLibrary("places")
      .then(() => setGoogleReady(true))
      .catch(() => setGoogleError(true));
  }, [ready]);

  useEffect(() => {
    if (!googleReady || !inputRef.current) return;

    const bounds = new window.google.maps.LatLngBounds(
      { lat: SYDNEY_BOUNDS.south, lng: SYDNEY_BOUNDS.west },
      { lat: SYDNEY_BOUNDS.north, lng: SYDNEY_BOUNDS.east }
    );

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "au" },
      fields: ["formatted_address"],
      types: ["address"],
      bounds,
      strictBounds: false,
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.formatted_address) return;
      const address = cleanAddress(place.formatted_address);
      if (inputRef.current) inputRef.current.value = address;
      setTyped(false);
      onChangeRef.current(address);
    });

    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [googleReady]);

  // Manual fallback — no API key or load error
  if (!GOOGLE_API_KEY || googleError) {
    return (
      <label className={`field field-wide ${showValidation && !value.trim() ? "has-error" : ""}`}>
        <span>Address</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChangeRef.current(e.target.value)}
          placeholder="Property or site address"
          autoComplete="off"
        />
      </label>
    );
  }

  // Google autocomplete — user must select from dropdown, typing alone doesn't count
  const showSelectHint = showValidation && !value.trim() && typed;
  const showEmptyError = showValidation && !value.trim() && !typed;

  return (
    <div className={`field field-wide ${showEmptyError || showSelectHint ? "has-error" : ""}`}>
      <span>Address</span>
      <input
        ref={inputRef}
        type="text"
        defaultValue={value}
        placeholder="Start typing your address…"
        autoComplete="off"
        onChange={() => {
          setTyped(true);
          onChangeRef.current("");
        }}
      />
      {showSelectHint && (
        <span className="field-error-hint">
          Please select an address from the dropdown list.
        </span>
      )}
    </div>
  );
}
