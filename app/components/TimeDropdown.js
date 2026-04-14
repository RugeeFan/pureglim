"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const TIME_OPTIONS = ["Any time", "Morning (8am – 12pm)", "Afternoon (12pm – 5pm)"];

export default function TimeDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e) {
      const inMenu = menuRef.current?.contains(e.target);
      const inTrigger = triggerRef.current?.contains(e.target);
      if (!inMenu && !inTrigger) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function handleOpen() {
    if (open) { setOpen(false); return; }
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    setOpen(true);
  }

  return (
    <div className="custom-field-wrap">
      <button
        ref={triggerRef}
        className={`custom-field-trigger ${open ? "is-open" : ""}`}
        type="button"
        onClick={handleOpen}
      >
        <span>{value || "Any time"}</span>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      {mounted && open && createPortal(
        <div
          ref={menuRef}
          className="time-dropdown-portal"
          style={{
            position: "fixed",
            top: menuPos.top,
            left: menuPos.left,
            width: menuPos.width,
            zIndex: 9999,
          }}
        >
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt}
              className={`time-option ${value === opt ? "is-selected" : ""}`}
              type="button"
              onClick={() => { onChange("preferredTime", opt); setOpen(false); }}
            >
              {opt}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
