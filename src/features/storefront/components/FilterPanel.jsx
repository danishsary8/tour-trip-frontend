import { useId } from "react";
import { cn } from "../../../lib/cn";
import { formatUsd } from "../../../lib/format";
import { DURATION_OPTIONS, RATING_OPTIONS } from "../filters";

function Group({ title, children }) {
  return (
    <fieldset className="border-b border-border pb-6 last:border-b-0 last:pb-0">
      <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground">{title}</legend>
      {children}
    </fieldset>
  );
}

const optionRow =
  "flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-foreground transition-colors duration-200 hover:bg-foreground/[0.05] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/50 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-45";

function CheckList({ options, selected, onChange, name }) {
  function toggle(id) {
    onChange(selected.includes(id) ? selected.filter((value) => value !== id) : [...selected, id]);
  }
  return (
    <ul className="space-y-0.5">
      {options.map((option) => (
        <li key={option.id}>
          <label className={optionRow}>
            <input
              type="checkbox"
              name={name}
              checked={selected.includes(option.id)}
              disabled={!option.count && !selected.includes(option.id)}
              onChange={() => toggle(option.id)}
              className="size-4 rounded border-border accent-primary outline-none"
            />
            <span className="flex-1">{option.name}</span>
            <span className="text-xs tabular-nums text-muted">{option.count}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}

function RadioList({ options, value, onChange, name }) {
  return (
    <div className="space-y-0.5" role="radiogroup">
      {options.map((option) => (
        <label key={option.value || "any"} className={optionRow}>
          <input type="radio" name={name} checked={value === option.value} onChange={() => onChange(option.value)} className="size-4 accent-primary outline-none" />
          {option.label}
        </label>
      ))}
    </div>
  );
}

/** Two native range inputs sharing one track: keyboard and screen-reader friendly. */
function PriceRange({ bounds, min, max, onChange }) {
  const id = useId();
  const low = min ?? bounds.min;
  const high = max ?? bounds.max;
  const span = Math.max(1, bounds.max - bounds.min);
  const left = ((low - bounds.min) / span) * 100;
  const right = ((high - bounds.min) / span) * 100;
  const thumb =
    "pointer-events-none absolute inset-x-0 top-1/2 h-5 w-full -translate-y-1/2 appearance-none bg-transparent outline-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,.25)] [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110 focus-visible:[&::-webkit-slider-thumb]:ring-4 focus-visible:[&::-webkit-slider-thumb]:ring-primary/30";

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm font-semibold tabular-nums text-foreground" aria-live="polite">
        <span>{formatUsd(low)}</span>
        <span className="text-muted">to</span>
        <span>{formatUsd(high)}</span>
      </div>
      <div className="relative h-5">
        <span className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-foreground/10" aria-hidden="true" />
        <span className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary" style={{ left: `${left}%`, right: `${100 - right}%` }} aria-hidden="true" />
        <label htmlFor={`${id}-min`} className="sr-only">
          Minimum price
        </label>
        <input
          id={`${id}-min`}
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={5}
          value={low}
          onChange={(event) => onChange(Math.min(Number(event.target.value), high - 5), high)}
          className={thumb}
        />
        <label htmlFor={`${id}-max`} className="sr-only">
          Maximum price
        </label>
        <input
          id={`${id}-max`}
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={5}
          value={high}
          onChange={(event) => onChange(low, Math.max(Number(event.target.value), low + 5))}
          className={thumb}
        />
      </div>
      <p className="mt-3 text-xs text-muted">Per person, in USD</p>
    </div>
  );
}

/** Filters for /tours. Used in the sticky desktop sidebar and inside the mobile drawer. */
export function FilterPanel({ filters, onChange, destinations, categories, bounds, className }) {
  return (
    <div className={cn("space-y-6", className)}>
      <Group title="Destination">
        <CheckList
          name="destination"
          options={destinations.map((item) => ({ id: item.id, name: item.name, count: item.tourCount }))}
          selected={filters.destination}
          onChange={(destination) => onChange({ destination })}
        />
      </Group>
      <Group title="Travel style">
        <CheckList
          name="category"
          options={categories.map((item) => ({ id: item.id, name: item.name, count: item.tourCount }))}
          selected={filters.category}
          onChange={(category) => onChange({ category })}
        />
      </Group>
      <Group title="Price">
        <PriceRange
          bounds={bounds}
          min={filters.min}
          max={filters.max}
          onChange={(min, max) => onChange({ min: min <= bounds.min ? null : min, max: max >= bounds.max ? null : max })}
        />
      </Group>
      <Group title="Duration">
        <RadioList name="duration" options={DURATION_OPTIONS} value={filters.duration} onChange={(duration) => onChange({ duration })} />
      </Group>
      <Group title="Traveller rating">
        <RadioList name="rating" options={RATING_OPTIONS} value={filters.rating} onChange={(rating) => onChange({ rating })} />
      </Group>
    </div>
  );
}
