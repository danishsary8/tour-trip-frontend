import { useState } from 'react';
import { CalendarDays, ImageOff, MapPinned, Pencil, Trash2 } from 'lucide-react';

/**
 * Widths are honoured exactly because the table uses `table-fixed`, so columns
 * never resize between pages as content length changes. Description takes
 * whatever space is left over.
 */
const COLUMNS = [
  { key: 'thumbnail', label: 'Thumbnail', className: 'w-[96px]' },
  { key: 'name', label: 'Destination Name', className: 'w-[220px]' },
  { key: 'description', label: 'Description', className: 'w-auto' },
  { key: 'created', label: 'Created Date', className: 'w-[215px]' },
  { key: 'actions', label: 'Actions', className: 'w-[116px] text-right' },
];

/** Descriptions longer than this get cut back to a word boundary and trailed with dots. */
const DESCRIPTION_MAX_LENGTH = 60;

/** `2024-05-20` / ISO timestamp -> "May 20, 2024" */
function formatCreatedAt(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Shortens a long description on a word boundary and appends "..." so rows
 * never break their single-line rhythm — e.g.
 * "Gateway city to the Angkor temple complex..."
 */
function truncateDescription(text) {
  if (!text) return '—';
  if (text.length <= DESCRIPTION_MAX_LENGTH) return text;

  const clipped = text.slice(0, DESCRIPTION_MAX_LENGTH);
  const lastSpace = clipped.lastIndexOf(' ');
  const base = lastSpace > DESCRIPTION_MAX_LENGTH * 0.6 ? clipped.slice(0, lastSpace) : clipped;

  return `${base.replace(/[\s.,;:—-]+$/, '')}...`;
}

/** Square thumbnail that falls back to a placeholder when `image` is empty or fails to load. */
function Thumbnail({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className="grid size-11 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-400 ring-1 ring-slate-200/70 ring-inset"
        role="img"
        aria-label={`No image for ${alt}`}
      >
        <ImageOff size={16} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="size-11 shrink-0 rounded-lg object-cover ring-1 ring-slate-200/70 ring-inset transition duration-200 group-hover:ring-2 group-hover:ring-indigo-300"
    />
  );
}

function ActionButton({ label, tone, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={[
        'grid size-8 place-items-center rounded-lg transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40',
        tone,
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={COLUMNS.length} className="px-6 py-20">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="grid size-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
            <MapPinned size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">No destinations yet</p>
            <p className="mt-1 text-sm text-slate-400">
              Click "Add New Destination" to create your first one.
            </p>
          </div>
        </div>
      </td>
    </tr>
  );
}

/**
 * Destinations data table. Every column maps to a `destinations_tb` field.
 *
 * The header row is sticky against the admin scroll area, so it stays put while
 * the page scrolls. That only works when no ancestor creates its own scroll box,
 * hence `xl:overflow-visible` here and no `overflow-hidden` on the card.
 * Below xl the viewport is too narrow for the fixed columns, so the wrapper
 * scrolls horizontally instead and the header behaves normally.
 *
 * @param {{ destinations: Array<object>, onEdit: (d: object) => void, onDelete: (d: object) => void }} props
 */
export default function DestinationTable({ destinations, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto xl:overflow-visible">
      <table className="w-full min-w-[780px] table-fixed border-collapse text-left">
        <thead>
          <tr>
            {COLUMNS.map((col, index) => (
              <th
                key={col.key}
                scope="col"
                className={[
                  'sticky top-0 z-20 bg-slate-50 px-6 py-3',
                  'text-[11px] font-bold tracking-[0.08em] whitespace-nowrap text-slate-400 uppercase',
                  'shadow-[inset_0_-1px_0_rgb(226_232_240_/_0.7)]',
                  index === 0 ? 'rounded-tl-2xl' : '',
                  index === COLUMNS.length - 1 ? 'rounded-tr-2xl' : '',
                  col.className ?? '',
                ].join(' ')}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {destinations.length === 0 ? (
            <EmptyState />
          ) : (
            destinations.map((destination) => (
              <tr
                key={destination.destination_id}
                className="group transition-colors duration-150 hover:bg-slate-50/80"
              >
                <td className="px-6 py-2.5">
                  <Thumbnail src={destination.image} alt={destination.name} />
                </td>

                <td className="px-6 py-2.5">
                  <span className="block truncate text-[14.5px] font-bold tracking-tight text-slate-900">
                    {destination.name}
                  </span>
                </td>

                <td className="px-6 py-2.5">
                  <p
                    className="truncate text-sm text-slate-500"
                    title={destination.description || undefined}
                  >
                    {truncateDescription(destination.description)}
                  </p>
                </td>

                <td className="px-6 py-2.5">
                  <span className="inline-flex items-center gap-2 text-sm font-medium whitespace-nowrap text-slate-500 tabular-nums">
                    <CalendarDays size={14} className="shrink-0 text-slate-300" />
                    {formatCreatedAt(destination.created_at)}
                  </span>
                </td>

                <td className="px-6 py-2.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <ActionButton
                      label={`Edit ${destination.name}`}
                      tone="text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                      onClick={() => onEdit(destination)}
                    >
                      <Pencil size={16} />
                    </ActionButton>
                    <ActionButton
                      label={`Delete ${destination.name}`}
                      tone="text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      onClick={() => onDelete(destination)}
                    >
                      <Trash2 size={16} />
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
