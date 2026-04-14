"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import ScrollPicker from "./ScrollPicker";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const PANEL_GUTTER = 12;
const CALENDAR_PANEL_WIDTH = 280;
const CALENDAR_PANEL_HEIGHT = 338;
const SCROLL_PANEL_HEIGHT = 268;

function toISO(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatDateLabel(date) {
  return new Intl.DateTimeFormat("en-AU", {
    weekday: "short", day: "numeric", month: "short",
  }).format(date);
}

function formatDateDisplay(isoDate) {
  if (!isoDate) return "Choose a date";
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en-AU", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  }).format(new Date(y, m - 1, d));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getPanelPosition(rect, mode) {
  const isCalendar = mode === "calendar";
  const panelWidth = isCalendar
    ? Math.min(CALENDAR_PANEL_WIDTH, window.innerWidth - PANEL_GUTTER * 2)
    : Math.min(rect.width, window.innerWidth - PANEL_GUTTER * 2);
  const estimatedHeight = isCalendar ? CALENDAR_PANEL_HEIGHT : SCROLL_PANEL_HEIGHT;

  const preferredLeft = isCalendar ? rect.right - panelWidth : rect.left;
  const maxLeft = Math.max(PANEL_GUTTER, window.innerWidth - panelWidth - PANEL_GUTTER);
  const left = clamp(preferredLeft, PANEL_GUTTER, maxLeft);

  const preferredTop = rect.bottom + 6;
  const maxTop = window.innerHeight - estimatedHeight - PANEL_GUTTER;
  const top =
    preferredTop <= maxTop
      ? preferredTop
      : clamp(rect.top - estimatedHeight - 6, PANEL_GUTTER, Math.max(PANEL_GUTTER, maxTop));

  return { top, left, width: panelWidth };
}

function CalendarGrid({ value, onChange, onClose }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initDate = value
    ? (() => { const [y, m] = value.split("-").map(Number); return { y, m: m - 1 }; })()
    : { y: today.getFullYear(), m: today.getMonth() };

  const [calYear, setCalYear] = useState(initDate.y);
  const [calMonth, setCalMonth] = useState(initDate.m);

  const firstDay = new Date(calYear, calMonth, 1);
  const lastDay = new Date(calYear, calMonth + 1, 0);

  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(d);

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  }

  function selectDay(day) {
    const date = new Date(calYear, calMonth, day);
    if (date < today) return;
    onChange("preferredDate", toISO(date));
    onClose();
  }

  return (
    <div className="date-cal-grid">
      <div className="date-cal-nav">
        <button className="date-cal-nav-btn" type="button" onClick={prevMonth}>
          <ChevronLeft size={14} />
        </button>
        <span className="date-cal-month-label">{MONTHS[calMonth]} {calYear}</span>
        <button className="date-cal-nav-btn" type="button" onClick={nextMonth}>
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="date-cal-weekdays">
        {WEEKDAYS.map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="date-cal-days">
        {cells.map((day, i) => {
          if (!day) return <span key={`e-${i}`} />;
          const thisDate = new Date(calYear, calMonth, day);
          const isPast = thisDate < today;
          const isToday = toISO(thisDate) === toISO(today);
          const isSelected = value && toISO(thisDate) === value;
          return (
            <button
              key={day}
              className={`date-cal-day ${isToday ? "is-today" : ""} ${isSelected ? "is-selected" : ""} ${isPast ? "is-past" : ""}`}
              disabled={isPast}
              type="button"
              onClick={() => selectDay(day)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DateScrollPicker({ value, onChange }) {
  const [mode, setMode] = useState(null); // null | "scroll" | "calendar"
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0, width: 320 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef(null);
  const calBtnRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  const { options, isoByLabel } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const opts = [];
    const map = {};
    for (let i = 0; i < 90; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = toISO(d);
      const label = formatDateLabel(d);
      opts.push(label);
      map[label] = iso;
    }
    return { options: opts, isoByLabel: map };
  }, []);

  const displayLabel = useMemo(() => {
    if (!value) return "";
    const [y, m, d] = value.split("-").map(Number);
    return formatDateLabel(new Date(y, m - 1, d));
  }, [value]);

  function openMode(newMode, fromRef) {
    if (mode === newMode) { setMode(null); return; }
    const rect = (fromRef ?? triggerRef).current.getBoundingClientRect();
    setPanelPos(getPanelPosition(rect, newMode));
    setMode(newMode);
  }

  useEffect(() => {
    if (!mode) return;
    function onClickOutside(e) {
      const inPanel = panelRef.current?.contains(e.target);
      const inTrigger = triggerRef.current?.contains(e.target);
      const inCal = calBtnRef.current?.contains(e.target);
      if (!inPanel && !inTrigger && !inCal) setMode(null);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [mode]);

  function handleScrollChange(_name, label) {
    onChange("preferredDate", isoByLabel[label] ?? "");
  }

  return (
    <div className="date-picker-row">
      <button
        ref={triggerRef}
        className={`custom-field-trigger date-trigger-main ${mode === "scroll" ? "is-open" : ""}`}
        type="button"
        onClick={() => openMode("scroll", triggerRef)}
      >
        <span>{formatDateDisplay(value)}</span>
      </button>
      <button
        ref={calBtnRef}
        aria-label="Open calendar"
        className={`date-cal-icon-btn ${mode === "calendar" ? "is-open" : ""}`}
        type="button"
        onClick={() => openMode("calendar", calBtnRef)}
      >
        <Calendar size={18} />
      </button>

      {mounted && mode && createPortal(
        <div
          ref={panelRef}
          className="date-picker-portal-panel"
          style={{
            position: "fixed",
            top: panelPos.top,
            left: panelPos.left,
            width: panelPos.width,
            zIndex: 9999,
          }}
        >
          {mode === "scroll" && (
            <ScrollPicker
              name="preferredDate"
              options={options}
              value={displayLabel}
              onChange={handleScrollChange}
              placeholder="Choose a date"
            />
          )}
          {mode === "calendar" && (
            <CalendarGrid
              value={value}
              onChange={onChange}
              onClose={() => setMode(null)}
            />
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
