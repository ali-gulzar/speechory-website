import { useState, type CSSProperties } from "react";
import NumberFlow from "@number-flow/react";

const USD: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
};

const dollars = (n: number) => new Intl.NumberFormat("en-US", USD).format(n);

const BOOKINGS = { min: 1, max: 60, step: 1, default: 12 };
const VALUE = { min: 50, max: 1500, step: 1, default: 350 };

const CHIPS = [
  { label: "$150 cleaning", v: 150 },
  { label: "$350 visit", v: 350 },
  { label: "$1,200 procedure", v: 1200 },
];

// 0..1 position of a value within its range — drives the slider fill + knob.
const frac = (v: number, min: number, max: number) => (v - min) / (max - min);

export default function Estimator() {
  const [bookings, setBookings] = useState(BOOKINGS.default);
  const [value, setValue] = useState(VALUE.default);

  const monthly = bookings * value;
  const annual = monthly * 12;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_0.82fr] lg:gap-12">
      {/* ---- Controls ---- */}
      <div className="reveal reveal-1 space-y-9">
        {/* Slider 1 — bookings recovered */}
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor="bookings" className="font-medium text-text">
              Bookings Max recovers per month
            </label>
            <span
              className="tnum text-2xl leading-none font-medium text-text"
              style={{ fontFamily: "var(--font-display)" }}
              aria-hidden="true"
            >
              {bookings}
            </span>
          </div>
          <div
            className="slider mt-4"
            style={{ "--p": frac(bookings, BOOKINGS.min, BOOKINGS.max) } as CSSProperties}
          >
            <div className="slider-track">
              <div className="slider-fill" />
            </div>
            <div className="slider-knob" />
            <input
              id="bookings"
              type="range"
              className="slider-input"
              min={BOOKINGS.min}
              max={BOOKINGS.max}
              step={BOOKINGS.step}
              value={bookings}
              aria-valuetext={`${bookings} bookings per month`}
              onChange={(e) => setBookings(Number(e.target.value))}
            />
          </div>
          <p className="mt-2.5 text-sm text-muted">
            Most clinics miss far more after-hours calls than they realize.
          </p>
        </div>

        {/* Slider 2 — average value per appointment */}
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor="value" className="font-medium text-text">
              Average revenue per appointment
            </label>
            <span
              className="tnum text-2xl leading-none font-medium text-text"
              style={{ fontFamily: "var(--font-display)" }}
              aria-hidden="true"
            >
              {dollars(value)}
            </span>
          </div>
          <div
            className="slider mt-4"
            style={{ "--p": frac(value, VALUE.min, VALUE.max) } as CSSProperties}
          >
            <div className="slider-track">
              <div className="slider-fill" />
            </div>
            <div className="slider-knob" />
            <input
              id="value"
              type="range"
              className="slider-input"
              min={VALUE.min}
              max={VALUE.max}
              step={VALUE.step}
              value={value}
              aria-valuetext={`${dollars(value)} per appointment`}
              onChange={(e) => setValue(Number(e.target.value))}
            />
          </div>
          <div className="mt-3.5 flex flex-wrap gap-2">
            {CHIPS.map((c) => {
              const active = value === c.v;
              return (
                <button
                  key={c.v}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setValue(c.v)}
                  className={
                    "rounded-full border px-3.5 py-1.5 text-sm transition " +
                    (active
                      ? "border-lime bg-lime font-medium text-text"
                      : "border-hairline bg-surface text-muted hover:border-lime hover:text-text")
                  }
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---- Payoff (lime "money" card) ---- */}
      <div className="reveal reveal-2 rounded-3xl bg-lime p-7 shadow-[0_26px_60px_-42px_rgba(25,19,20,0.45)]">
        <p className="text-xs tracking-[0.18em] text-text/60 uppercase">
          Revenue you&rsquo;d recover
        </p>

        <div aria-live="polite" aria-atomic="true">
          <div
            className="tnum mt-3 leading-none text-text"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.9rem,7vw,4.4rem)",
              fontWeight: 600,
            }}
          >
            <NumberFlow value={monthly} format={USD} locales="en-US" />
          </div>
          <p className="mt-2 text-text/70">recovered every month</p>
          <p className="mt-4 text-lg text-text">
            that&rsquo;s{" "}
            <span className="tnum font-medium">
              <NumberFlow value={annual} format={USD} locales="en-US" />
            </span>{" "}
            a year
          </p>
        </div>

        <p className="mt-3 text-sm text-text/70">
          ={" "}
          <span className="tnum font-medium text-text">{bookings}</span>{" "}
          appointments you&rsquo;d otherwise never know called.
        </p>

        <div className="mt-6 border-t border-black/10 pt-5">
          <p className="text-sm text-text/70">
            Speechory costs a fraction of one recovered booking a month.
          </p>
          <a
            href="#"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-medium text-white shadow-[0_8px_24px_-12px_rgba(25,19,20,0.6)] transition hover:-translate-y-0.5"
          >
            Start recovering these calls
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

        <p className="mt-5 text-xs text-text/55">
          Illustrative estimate based on your inputs — not a guarantee.
        </p>
      </div>
    </div>
  );
}
