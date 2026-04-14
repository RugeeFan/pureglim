"use client";

import { useEffect, useRef } from "react";

const pickerRowHeight = 56;

export default function ScrollPicker({ name, onChange, options, placeholder, value }) {
  const pickerRef = useRef(null);
  const scrollTimerRef = useRef(null);
  const values = ["", ...options];

  useEffect(() => {
    const element = pickerRef.current;
    if (!element) return;
    const selectedIndex = Math.max(0, options.indexOf(value) + 1);
    element.scrollTo({ top: selectedIndex * pickerRowHeight, behavior: "auto" });
  }, [options, value]);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  function syncValueFromScroll() {
    const element = pickerRef.current;
    if (!element) return;
    const selectedIndex = Math.round(element.scrollTop / pickerRowHeight);
    onChange(name, values[selectedIndex] ?? "");
  }

  function settleScroll() {
    const element = pickerRef.current;
    if (!element) return;
    const selectedIndex = Math.round(element.scrollTop / pickerRowHeight);
    element.scrollTo({ top: selectedIndex * pickerRowHeight, behavior: "smooth" });
  }

  return (
    <div className="picker-field picker-field-mobile">
      <div
        className={`picker-wheel ${value ? "has-value" : ""}`}
        onScroll={() => {
          syncValueFromScroll();
          if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
          scrollTimerRef.current = setTimeout(() => { settleScroll(); }, 90);
        }}
        ref={pickerRef}
      >
        {values.map((option, index) => {
          const label = option || placeholder;
          const isSelected = option === value || (!option && !value);
          return (
            <button
              className={`picker-option ${isSelected ? "is-selected" : ""} ${option ? "" : "is-placeholder"}`}
              data-index={index}
              key={label}
              onClick={() => {
                onChange(name, option);
                pickerRef.current?.scrollTo({ top: index * pickerRowHeight, behavior: "smooth" });
              }}
              type="button"
            >
              {label}
            </button>
          );
        })}
      </div>
      <div aria-hidden="true" className="picker-fade picker-fade-top" />
      <div aria-hidden="true" className="picker-fade picker-fade-bottom" />
      <div aria-hidden="true" className="picker-highlight" />
    </div>
  );
}
