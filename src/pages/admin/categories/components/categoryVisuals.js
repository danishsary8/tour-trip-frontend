import { LandmarkIcon, BeachIcon, MountainIcon, CityIcon, WildlifeIcon, AdventureIcon, LayersIcon } from './icons';

const VISUALS = {
  landmark: { icon: LandmarkIcon, bg: 'bg-violet-50', fg: 'text-violet-600' },
  beach: { icon: BeachIcon, bg: 'bg-sky-50', fg: 'text-sky-600' },
  mountain: { icon: MountainIcon, bg: 'bg-emerald-50', fg: 'text-emerald-600' },
  city: { icon: CityIcon, bg: 'bg-amber-50', fg: 'text-amber-600' },
  wildlife: { icon: WildlifeIcon, bg: 'bg-teal-50', fg: 'text-teal-600' },
  adventure: { icon: AdventureIcon, bg: 'bg-rose-50', fg: 'text-rose-600' },
};

const FALLBACK = { icon: LayersIcon, bg: 'bg-indigo-50', fg: 'text-indigo-600' };

export function getCategoryVisual(iconKey) {
  return VISUALS[iconKey] ?? FALLBACK;
}

/** Selectable icon options, used by the Add/Edit form. */
export const CATEGORY_ICON_OPTIONS = [
  { value: 'landmark', label: 'Landmark' },
  { value: 'beach', label: 'Beach' },
  { value: 'mountain', label: 'Mountain' },
  { value: 'city', label: 'City' },
  { value: 'wildlife', label: 'Wildlife' },
  { value: 'adventure', label: 'Adventure' },
];
