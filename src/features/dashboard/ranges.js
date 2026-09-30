export const RANGE_OPTIONS = [
  { value: "7D", label: "7D" },
  { value: "30D", label: "30D" },
  { value: "90D", label: "90D" },
  { value: "12M", label: "12M" },
];

export const DEFAULT_RANGE = "30D";

/** Words used in widget copy, e.g. "vs previous 30 days". */
export const RANGE_COPY = {
  "7D": { period: "last 7 days", previous: "vs previous 7 days" },
  "30D": { period: "last 30 days", previous: "vs previous 30 days" },
  "90D": { period: "last 90 days", previous: "vs previous 90 days" },
  "12M": { period: "last 12 months", previous: "vs previous 12 months" },
};

export const isRange = (value) => RANGE_OPTIONS.some((option) => option.value === value);
