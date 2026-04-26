"use client";

import { useEffect, useRef } from "react";

export default function ScrollPicker({ name, onChange, options, placeholder, value }) {
  const pickerRef = useRef(null);
  const scrollTimerRef = useRef(null);
  const values = ["", ...options];

  function getRowHeight() {
    return pickerRef.current?.clientHeight ?? 56;
  }

  useEffect(() => {
    const element = pickerRef.current;
    if (!element) return;
    const selectedIndex = Math.max(0, options.indexOf(value) + 1);
    element.scrollTo({ top: selectedIndex * getRowHeight(), behavior: "auto" });
  }, [options, value]);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  function handleScrollEnd() {
    const element = pickerRef.current;
    if (!element) return;
    const rowHeight = getRowHeight();
    const selectedIndex = Math.round(element.scrollTop / rowHeight);
    element.scrollTo({ top: selectedIndex * rowHeight, behavior: "smooth" });
    onChange(name, values[selectedIndex] ?? "");
  }

  return (
    <div className="picker-field picker-field-mobile">
      <div
        className={`picker-wheel ${value ? "has-value" : ""}`}
        onScroll={() => {
          if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
          scrollTimerRef.current = setTimeout(handleScrollEnd, 200);
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
                pickerRef.current?.scrollTo({ top: index * getRowHeight(), behavior: "smooth" });
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
