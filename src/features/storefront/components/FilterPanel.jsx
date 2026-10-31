import { useId } from "react";
import { cn } from "../../../lib/cn";
import { formatUsd } from "../../../lib/format";
import { DURATION_OPTIONS, RATING_OPTIONS, REGION_OPTIONS } from "../filters";

function Group({ title, children }) {
  return (
    <fieldset className="border-t border-border pt-5 first:border-t-0 first:pt-0">
      <legend className="float-left mb-3 w-full text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

const optionRow =
  "flex cursor-pointer items-center gap-3 rounded-lg px-1.5 py-1 text-sm text-foreground transition-colors duration-200 hover:bg-foreground/[0.05] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/50 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-45";

function CheckList({ options, selected, onChange, name, heading }) {
  function toggle(id) {
    onChange(selected.includes(id) ? selected.filter((value) => value !== id) : [...selected, id]);
  }
  return (
    <ul className="space-y-0.5" aria-label={heading}>
      {heading && <li aria-hidden="true" className="px-1.5 pb-1 pt-2 text-xs font-medium text-muted first:pt-0">{heading}</li>}
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

/** Anywhere / Cambodia / International as a compact segmented control. */
function RegionSwitch({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-full bg-foreground/[0.06] p-1" role="radiogroup" aria-label="Where">
      {REGION_OPTIONS.map((option) => (
        <label
          key={option.value || "any"}
          className={cn(
            "cursor-pointer rounded-full px-2 py-1.5 text-center text-xs font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/60",
            value === option.value ? "bg-surface text-foreground shadow-sm" : "text-muted hover:text-foreground",
          )}
        >
          <input type="radio" name="region" className="sr-only" checked={value === option.value} onChange={() => onChange(option.value)} />
          {option.value === "international" ? "Abroad" : option.label}
        </label>
      ))}
    </div>
  );
}

/** Filters for /tours. Used in the sticky desktop sidebar and inside the mobile drawer. */
export function FilterPanel({ filters, onChange, destinations, categories, bounds, className }) {
  const toOption = (item) => ({ id: item.id, name: item.name, count: item.tourCount });
  const home = destinations.filter((item) => !item.international);
  const abroad = destinations.filter((item) => item.international);
  const changeDestination = (destination) => onChange({ destination });
  // Choosing a region drops destinations from the other one, so the two filters never contradict.
  const changeRegion = (region) => {
    const keep = new Set((region === "international" ? abroad : region === "cambodia" ? home : destinations).map((item) => item.id));
    onChange({ region, destination: filters.destination.filter((id) => keep.has(id)) });
  };
  return (
    <div className={cn("space-y-5", className)}>
      <Group title="Where">
        <RegionSwitch value={filters.region} onChange={changeRegion} />
      </Group>
      <Group title="Destination">
        {filters.region !== "international" && (
          <CheckList name="destination" heading={abroad.length ? "Cambodia" : undefined} options={home.map(toOption)} selected={filters.destination} onChange={changeDestination} />
        )}
        {filters.region !== "cambodia" && abroad.length > 0 && (
          <CheckList name="destination" heading="Beyond Cambodia" options={abroad.map(toOption)} selected={filters.destination} onChange={changeDestination} />
        )}
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
